import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import type { FileItem, ImageFileFieldProps } from './ImageFileField.interface'
import {
  clearButton,
  containerBox,
  dropZone,
  errorText,
  listItem,
  uploadIcon,
} from './ImageFileField.styles'
import { createFileItem, fakeAiProcess, formatFileSize, pathToFile } from './ImageFileFieldUtils'

/**
 * ImageFileField component
 *
 * A file input field with support for drag & drop, preview thumbnails,
 * file validation, and optional AI processing simulation.
 */
const ImageFileField = React.forwardRef<HTMLInputElement, ImageFileFieldProps>(
  function ImageFileField(
    {
      onChange,
      onOpenFileDialog,
      fileTypes,
      multiple = false,
      onImageProcess,
      onDrop,
      minFiles,
      maxFiles,
      maxFileSize,
      placeholder,
    },
    _ref,
  ) {
    const [isDragging, setIsDragging] = useState(false)
    const [fileItems, setFileItems] = useState<FileItem[]>([])
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
    const [selectAll, setSelectAll] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // cleanup preview URLs on unmount
    useEffect(() => {
      return () => {
        fileItems.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
      }
    }, [fileItems])

    /**
     * Validate incoming files against props
     */
    const validateFiles = (incoming: File[]): { ok: boolean; message?: string } => {
      if (maxFiles && fileItems.length + incoming.length > maxFiles) {
        return { ok: false, message: `Maximum ${maxFiles} files allowed` }
      }
      if (minFiles && fileItems.length + incoming.length < minFiles) {
        return { ok: false, message: `At least ${minFiles} files required` }
      }
      if (maxFileSize) {
        const oversized = incoming.find((f) => f.size > maxFileSize)
        if (oversized) {
          return {
            ok: false,
            message: `File ${oversized.name} exceeds max size (${formatFileSize(maxFileSize)})`,
          }
        }
      }
      if (fileTypes && fileTypes.length > 0) {
        const invalid = incoming.find(
          (f) => !fileTypes.some((ext) => f.name.toLowerCase().endsWith(ext.toLowerCase())),
        )
        if (invalid) {
          return { ok: false, message: `File type not supported: ${invalid.name}` }
        }
      }
      return { ok: true }
    }

    /**
     * Handle "select file(s)" click
     */
    const handleFileSelection = async () => {
      try {
        const files = await onOpenFileDialog?.(multiple, fileTypes)
        if (!files) return
        const arr: Array<File | string> = Array.isArray(files) ? files : [files]
        handleFiles(arr)
      } catch {
        // ignore
      }
    }

    /**
     * Handle files from any source (dialog or drag/drop)
     */
    const handleFiles = async (files: Array<File | string>) => {
      if (files.length === 0) return

      const actualFiles = files.filter((f): f is File => f instanceof File)
      const validation = validateFiles(actualFiles)
      if (!validation.ok) {
        setError(validation.message ?? 'Invalid file(s)')
        return
      }
      setError(null)

      const newItems = files.map(createFileItem)
      const final = multiple ? [...fileItems, ...newItems] : [newItems[0]]
      setFileItems(final)

      // notify parent with string paths only
      const originalFiles = final.map((fi) => fi.originalFile)
      const stringFiles = originalFiles.filter((f): f is string => typeof f === 'string')
      if (multiple) onChange?.(stringFiles)
      else onChange?.(stringFiles[0] ?? null)

      // notify onDrop with File objects
      if (onDrop && actualFiles.length > 0) onDrop(actualFiles)

      // auto-select newly added files
      const newSelected = new Set(selectedFiles)
      if (multiple) {
        const startIndex = fileItems.length
        newItems.forEach((_, i) => newSelected.add(final[startIndex + i].id))
      } else {
        newSelected.clear()
        newSelected.add(final[0].id)
      }
      setSelectedFiles(newSelected)
      setSelectAll(newSelected.size === final.length)
    }

    /**
     * Handle drag & drop
     */
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        await handleFiles(droppedFiles)
      }
    }

    /**
     * Run fake AI extraction on selected files
     */
    const handleRunAIExtraction = async () => {
      if (selectedFiles.size === 0) return
      setIsProcessing(true)
      try {
        const selected = fileItems.filter((f) => selectedFiles.has(f.id))
        const filesToProcess = await Promise.all(
          selected.map((item) =>
            item.originalFile instanceof File
              ? Promise.resolve(item.originalFile)
              : pathToFile(String(item.originalFile)),
          ),
        )
        if (onImageProcess) {
          const results = await Promise.all(filesToProcess.map(fakeAiProcess))
          onImageProcess(results, filesToProcess)
        }
      } finally {
        setIsProcessing(false)
      }
    }

    /**
     * Choose file icon based on type
     */
    const getFileIcon = (file: FileItem) => {
      if (file.type.startsWith('image/') && file.previewUrl) {
        return (
          <Box
            component="img"
            src={file.previewUrl}
            alt={file.name}
            sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
          />
        )
      }
      if (file.type === 'application/pdf') return <PictureAsPdfIcon color="error" />
      return <DescriptionIcon color="primary" />
    }

    const placeholderText =
      placeholder ??
      `Drag files here or click to select files\nOnly ${fileTypes?.join(', ') || 'all'} supported, up to ${
        maxFiles ?? '∞'
      } files, ${maxFileSize ? formatFileSize(maxFileSize) : 'any size'} each`

    // --- Render ---
    return (
      <Box>
        {fileItems.length > 0 ? (
          <Box sx={containerBox}>
            <Stack
              direction="row"
              justifyContent="space-between"
              mb={2}
              spacing={2}
              flexWrap="wrap"
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Select Files ({selectedFiles.size}/{fileItems.length})
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Button variant="text" onClick={handleFileSelection}>
                  {multiple ? 'Add More Files' : 'Add Another File'}
                </Button>
                {multiple && fileItems.length > 1 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectAll}
                        onChange={(e) => setSelectAll(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Select All"
                  />
                )}
              </Stack>
            </Stack>

            <List>
              {fileItems.map((fileItem) => (
                <ListItem key={fileItem.id} sx={listItem(selectedFiles.has(fileItem.id))}>
                  <Checkbox
                    checked={selectedFiles.has(fileItem.id)}
                    onChange={() =>
                      setSelectedFiles((prev) => {
                        const newSet = new Set(prev)
                        if (newSet.has(fileItem.id)) {
                          newSet.delete(fileItem.id)
                        } else {
                          newSet.add(fileItem.id)
                        }
                        setSelectAll(newSet.size === fileItems.length)
                        return newSet
                      })
                    }
                    color="primary"
                  />
                  {getFileIcon(fileItem)}
                  <Box flex={1}>
                    <Typography
                      variant="body2"
                      fontWeight={selectedFiles.has(fileItem.id) ? 600 : 400}
                    >
                      {fileItem.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fileItem.type}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(fileItem.size)}
                  </Typography>
                  <IconButton size="small" onClick={() => {}}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>

            {error && (
              <Typography variant="caption" color="error" sx={errorText}>
                {error}
              </Typography>
            )}

            <Stack spacing={1.5} alignItems="center" mt={2}>
              <Button variant="text" sx={clearButton} onClick={() => setFileItems([])}>
                Clear All
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRunAIExtraction}
                disabled={selectedFiles.size === 0 || isProcessing}
              >
                {isProcessing
                  ? 'Processing...'
                  : `Run AI Extraction on ${selectedFiles.size} file(s)`}
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box
            onClick={handleFileSelection}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            sx={dropZone(isDragging)}
          >
            <FileUploadOutlined sx={uploadIcon(isDragging)} />
            <Typography variant="body1" fontWeight={500} whiteSpace="pre-line">
              {placeholderText}
            </Typography>
          </Box>
        )}
      </Box>
    )
  },
)

export default ImageFileField
