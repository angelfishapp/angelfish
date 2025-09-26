import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

/**
 * Self-contained types so this file has no external type dependency.
 * Adjust these if you already have a shared FileFieldProps definition.
 */
export interface FileFieldProps {
  onChange?: (files: Array<string> | string | null) => void
  onOpenFileDialog: (
    multiple: boolean,
    fileTypes?: string[],
  ) => Promise<File | File[] | string | string[] | null>
  fileTypes?: string[]
  multiple?: boolean
  value: string[] | string | null
}

interface ImageFileFieldProps extends FileFieldProps {
  onImageProcess?: (data: any[], files: File[]) => void
  onDrop?: (files: File[]) => void
  minFiles?: number
  maxFiles?: number
  maxFileSize?: number // bytes
  placeholder?: string
}

interface FileItem {
  id: string
  name: string
  size?: number
  type: string
  lastModified: number
  originalFile: File | string
  previewUrl?: string
}

// --- Helpers ---
const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return 'Unknown size'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(1)} ${units[i] ?? 'B'}`
}

const extToMime: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  heic: 'image/heic',
  csv: 'text/csv',
  ofx: 'application/x-ofx',
  qif: 'application/qif',
}

// Create FileItem from File or path string
const createFileItem = (file: File | string): FileItem => {
  if (file instanceof File) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    return {
      id: generateId(),
      name: file.name,
      size: file.size > 0 ? file.size : undefined, // الحجم الحقيقي للملف
      type: file.type || extToMime[extension] || 'application/octet-stream',
      lastModified: file.lastModified || Date.now(),
      originalFile: file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }
  }

  // لو الملف string (رابط أو path)
  const fileName = file.split('/').pop()?.split('\\').pop() || file
  const extension = fileName.split('.').pop()?.toLowerCase() ?? ''

  return {
    id: generateId(),
    name: fileName,
    size: undefined,
    type: extToMime[extension] ?? 'application/octet-stream',
    lastModified: Date.now(),
    originalFile: file,
  }
}

// Convert string path to empty File placeholder (used when original is string)
const pathToFile = async (filePath: string): Promise<File> => {
  const fileName = filePath.split('/').pop()?.split('\\').pop() || 'file'
  return new File([], fileName, {
    type: 'application/octet-stream',
    lastModified: Date.now(),
  })
}

// Fake AI process (keeps as-is)
async function fakeAiProcess(file: File): Promise<any> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          text: `Extracted data from ${file.name}`,
          fileName: file.name,
          size: file.size,
          type: file.type,
        }),
      1000,
    ),
  )
}

// --- Component ---
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
    }: ImageFileFieldProps,
    _ref,
  ) {
    const [isDragging, setIsDragging] = useState(false)
    const [fileItems, setFileItems] = useState<FileItem[]>([])
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
    const [selectAll, setSelectAll] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // cleanup object URLs on unmount or when fileItems change
    useEffect(() => {
      return () => {
        fileItems.forEach((f) => {
          if (f.previewUrl) {
            URL.revokeObjectURL(f.previewUrl)
          }
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // revoke preview URLs when removing items
    useEffect(() => {
      // revoke any URLs that no longer exist in fileItems
      return () => {
        // This effect body intentionally empty; the revoke happens in delete/clear logic to avoid double revoke.
      }
    }, [fileItems])

    const validateFiles = (incoming: File[]): { ok: boolean; message?: string } => {
      if (maxFiles && fileItems.length + incoming.length > maxFiles) {
        return { ok: false, message: `Maximum ${maxFiles} files allowed` }
      }
      if (minFiles && fileItems.length + incoming.length < minFiles) {
        // not usually used on add, but keep for completeness
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

    const handleFileSelection = async () => {
      try {
        const files = await onOpenFileDialog?.(multiple, fileTypes)
        if (!files) return
        const arr: Array<File | string> = Array.isArray(files) ? files : [files]
        handleFiles(arr)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // ignore
      }
    }

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

      // if we created preview URLs for new images, keep them (they were created in createFileItem)
      // notify external change with originalFile paths (strings) only, like previous behavior
      const originalFiles = final.map((fi) => fi.originalFile)
      const stringFiles = originalFiles.filter((f): f is string => typeof f === 'string')
      if (multiple) {
        onChange?.(stringFiles)
      } else {
        onChange?.(stringFiles[0] ?? null)
      }

      // call onDrop with actual File objects (not string placeholders)
      if (onDrop && actualFiles.length > 0) {
        onDrop(actualFiles)
      }

      // auto-select behavior: add newly added items' ids to selection
      const newSelected = new Set(selectedFiles)
      if (multiple) {
        const startIndex = fileItems.length
        newItems.forEach((_, i) => newSelected.add(final[startIndex + i]?.id ?? generateId()))
      } else {
        newSelected.clear()
        newSelected.add(final[0].id)
      }
      setSelectedFiles(newSelected)
      setSelectAll(newSelected.size === final.length)
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        await handleFiles(droppedFiles)
      }
    }

    const toggleFileSelection = (id: string) => {
      const newSet = new Set(selectedFiles)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      setSelectedFiles(newSet)
      setSelectAll(newSet.size === fileItems.length)
    }

    const toggleSelectAll = (checked: boolean) => {
      setSelectAll(checked)
      setSelectedFiles(checked ? new Set(fileItems.map((f) => f.id)) : new Set())
    }

    const deleteFile = (id: string) => {
      const target = fileItems.find((f) => f.id === id)
      // revoke preview url if any
      if (target?.previewUrl) {
        try {
          URL.revokeObjectURL(target.previewUrl)
        } catch {
          /* ignore */
        }
      }
      const updated = fileItems.filter((f) => f.id !== id)
      setFileItems(updated)

      const newSelected = new Set(selectedFiles)
      newSelected.delete(id)
      setSelectedFiles(newSelected)
      setSelectAll(newSelected.size === updated.length)

      // notify onChange with updated original string paths only (mirror previous contract)
      const originalFiles = updated.map((fi) => fi.originalFile)
      const stringFiles = originalFiles.filter((f): f is string => typeof f === 'string')
      if (multiple) {
        onChange?.(stringFiles)
      } else {
        onChange?.(stringFiles[0] ?? null)
      }
    }

    const clearUploads = () => {
      // revoke all preview URLs
      fileItems.forEach((f) => {
        if (f.previewUrl) {
          try {
            URL.revokeObjectURL(f.previewUrl)
          } catch {
            // ignore
          }
        }
      })
      setFileItems([])
      setSelectedFiles(new Set())
      setSelectAll(false)
      onChange?.([])
    }

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
          const results = await Promise.all(filesToProcess.map((file) => fakeAiProcess(file)))
          onImageProcess(results, filesToProcess)
        }
      } finally {
        setIsProcessing(false)
      }
    }

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
          <Box sx={{ borderRadius: 2, p: 2, bgcolor: 'background.paper' }}>
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
                        onChange={(e) => toggleSelectAll(e.target.checked)}
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
                <ListItem
                  key={fileItem.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    mb: 1,
                    p: 1.5,
                    gap: 2,
                    bgcolor: selectedFiles.has(fileItem.id) ? 'primary.lighter' : 'transparent',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Checkbox
                    checked={selectedFiles.has(fileItem.id)}
                    onChange={() => toggleFileSelection(fileItem.id)}
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
                  <IconButton size="small" onClick={() => deleteFile(fileItem.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>

            {error && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                {error}
              </Typography>
            )}

            <Stack spacing={1.5} alignItems="center" mt={2}>
              <Button variant="text" sx={{ color: 'error.main' }} onClick={clearUploads}>
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
            sx={{
              border: isDragging ? '3px solid' : '2px dashed',
              borderColor: isDragging ? 'primary.main' : 'grey.500',
              borderRadius: 2,
              p: 5,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragging ? 'primary.lighter' : 'transparent',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <FileUploadOutlined
              sx={{ fontSize: 48, color: isDragging ? 'primary.main' : 'grey.600', mb: 1 }}
            />
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
