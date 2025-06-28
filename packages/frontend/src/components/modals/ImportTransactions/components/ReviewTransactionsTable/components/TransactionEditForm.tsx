"use client"

import React from "react"
import { Box, FormLabel } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckBox from '@mui/material/Checkbox'

// Import your existing form components
import { TextField } from '@/components/forms/TextField'
import { TagsField } from '@/components/forms/TagsField'
import type { ITag } from "@angelfish/core"


interface ReconciledTransaction {
    id: string
    title: string
    amount: number
    date: Date
    note?: string
    tags?: ITag[]
    isReviewed?: boolean
    category_id?: string
    category?: any
}

interface TransactionEditFormProps {
    transaction: any
    allTags?: ITag[]
    onUpdate: (updates: Partial<ReconciledTransaction>) => void
}

export default function TransactionEditForm({
    transaction,
    allTags = [],
    onUpdate,
}: TransactionEditFormProps) {
    const [note, setNote] = React.useState(transaction.note || "")
    const [tags, setTags] = React.useState<ITag[]>(transaction.tags || [])
    const [isReviewed, setIsReviewed] = React.useState(transaction.isReviewed || false)

    const handleNotesChange = (value: string) => {
        setNote(value)
        onUpdate({ note: value })
    }

    const handleTagsChange = (newTags: ITag[]) => {
        setTags(newTags)
        onUpdate({ tags: newTags })
    }

    const handleReviewedChange = (checked: boolean) => {
        setIsReviewed(checked)
        onUpdate({ isReviewed: checked })
    }

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: "grey.50",
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            {/* Single Row with 3 Fields */}
            <Box sx={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 2, alignItems: "start" }}>

                {/* Notes Field */}
                <Box>
                    <FormLabel sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary", mb: 0.5, display: "block" }}>
                        Notes
                    </FormLabel>
                    <TextField
                        margin="none"
                        fullWidth
                        placeholder="Add a note..."
                        value={note}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        size="small"
                    />
                </Box>

                {/* Tags Field */}
                <Box>
                    <FormLabel sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary", mb: 0.5, display: "block" }}>
                        Tags
                    </FormLabel>
                    <TagsField
                        margin="none"
                        tags={allTags}
                        fullWidth
                        value={tags}
                        onChange={(newTags) => handleTagsChange(newTags as ITag[])}
                        size="small"
                    />
                </Box>

                {/* Reviewed Field */}
                <Box>
                    <FormLabel sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary", mb: 0.5, display: "block" }}>
                        Reviewed
                    </FormLabel>
                    <div className="is_reviewed">
                        <CheckBox
                            color={isReviewed ? 'success' : undefined}
                            icon={<CheckCircleOutlineIcon />}
                            checked={isReviewed}
                            checkedIcon={<CheckCircleIcon />}
                            onChange={(e) => handleReviewedChange(e.target.checked)}
                        />
                    </div>
                </Box>
            </Box>
        </Box>
    )
}