"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Box,
    Checkbox,
    TextField,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse,
    IconButton,
    InputAdornment,
} from "@mui/material"
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    IndeterminateCheckBox as IndeterminateCheckBoxIcon,
} from "@mui/icons-material"

// Generic interface for the component props
interface MultiSelectFieldProps<T> {
    options: readonly T[]
    value?: T[]
    defaultValue?: T[]
    onChange?: (event: React.SyntheticEvent, value: T[]) => void
    getOptionLabel?: (option: T) => string
    getOptionKey?: (option: T) => string | number
    groupBy?: (option: T) => string
    isOptionEqualToValue?: (option: T, value: T) => boolean
    filterOptions?: (options: T[], state: any) => T[]
    disabled?: boolean
    readOnly?: boolean
    placeholder?: string
    maxHeight?: number | string
    renderOption?: (props: any, option: T, state: any) => React.ReactNode
    renderGroup?: (params: any) => React.ReactNode
}

export default function MultiSelectField<T>({
    options,
    value = [],
    defaultValue = [],
    onChange,
    getOptionLabel = (option: any) => option.label || option.name || String(option),
    getOptionKey = (option: any) => option.id || option.key || getOptionLabel(option),
    groupBy,
    isOptionEqualToValue = (option: any, value: any) => getOptionKey(option) === getOptionKey(value),
    disabled = false,
    readOnly = false,
    placeholder = "Search categories...",
    maxHeight = 400,
    renderOption,
    renderGroup,
}: MultiSelectFieldProps<T>) {
    const [expandedGroups, setExpandedGroups] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Use the controlled value or fall back to internal state
    const selectedOptions = value || defaultValue

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return options

        return options.filter((option) => getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase()))
    }, [options, searchTerm, getOptionLabel])

    // Group the filtered options
    const groupedOptions = useMemo(() => {
        if (!groupBy) {
            return [{ group: null, options: filteredOptions }]
        }

        const groups = new Map<string, T[]>()

        filteredOptions.forEach((option) => {
            const group = groupBy(option)
            if (!groups.has(group)) {
                groups.set(group, [])
            }
            groups.get(group)!.push(option)
        })

        return Array.from(groups.entries()).map(([group, options]) => ({
            group,
            options,
        }))
    }, [filteredOptions, groupBy])

    // Initialize expanded groups
    useEffect(() => {
        const groupNames = groupedOptions.map((g) => g.group).filter(Boolean) as string[]
        setExpandedGroups((prev) => {
            const newGroups = groupNames.filter((name) => !prev.includes(name))
            return newGroups.length > 0 ? [...prev, ...newGroups] : prev
        })
    }, [groupedOptions])

    // Check if a group is partially selected
    const isGroupPartiallySelected = (groupOptions: T[]) => {
        if (!groupOptions.length) return false
        const selectedCount = groupOptions.filter((option) =>
            selectedOptions.some((selected) => isOptionEqualToValue(option, selected)),
        ).length
        return selectedCount > 0 && selectedCount < groupOptions.length
    }

    // Check if a group is fully selected
    const isGroupSelected = (groupOptions: T[]) => {
        if (!groupOptions.length) return false
        return groupOptions.every((option) => selectedOptions.some((selected) => isOptionEqualToValue(option, selected)))
    }

    // Handle individual option selection
    const handleOptionToggle = (option: T) => {
        if (!onChange || disabled || readOnly) return

        const isSelected = selectedOptions.some((selected) => isOptionEqualToValue(option, selected))
        let newValue: T[]

        if (isSelected) {
            newValue = selectedOptions.filter((selected) => !isOptionEqualToValue(option, selected))
        } else {
            newValue = [...selectedOptions, option]
        }

        onChange({} as React.SyntheticEvent, newValue)
    }

    // Handle group selection
    const handleGroupToggle = (groupOptions: T[]) => {
        if (!onChange || disabled || readOnly) return

        const isSelected = isGroupSelected(groupOptions)
        let newValue: T[]

        if (isSelected) {
            // Deselect all options in the group
            newValue = selectedOptions.filter(
                (selected) => !groupOptions.some((option) => isOptionEqualToValue(option, selected)),
            )
        } else {
            // Select all options in the group
            newValue = [...selectedOptions]
            groupOptions.forEach((option) => {
                if (!newValue.some((selected) => isOptionEqualToValue(option, selected))) {
                    newValue.push(option)
                }
            })
        }

        onChange({} as React.SyntheticEvent, newValue)
    }

    // Toggle group expansion
    const handleGroupExpand = (groupName: string) => {
        setExpandedGroups((prev) => {
            if (prev.includes(groupName)) {
                return prev.filter((name) => name !== groupName)
            }
            return [...prev, groupName]
        })
    }

    // Select all options
    const handleSelectAll = () => {
        if (!onChange || disabled || readOnly) return
        onChange({} as React.SyntheticEvent, [...options])
    }

    // Unselect all options
    const handleUnselectAll = () => {
        if (!onChange || disabled || readOnly) return
        onChange({} as React.SyntheticEvent, [])
    }

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm("")
    }

    return (
        <Box sx={{ width: "100%", maxWidth: 500 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Categories
                </Typography>

                {/* Selected categories count */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {selectedOptions.length} selected
                    </Typography>
                </Box>

                {/* Search box - positioned directly above the list */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    margin="normal"
                    size="small"
                    disabled={disabled}
                    sx={{ mb: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm ? (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClearSearch} edge="end" disabled={disabled}>
                                    &times;
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />

                {/* Category list with fixed height */}
                <Paper
                    variant="outlined"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: maxHeight,
                        overflow: "hidden",
                    }}
                >
                    {/* Scrollable list area */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflow: "auto",
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(0,0,0,0.2)",
                                borderRadius: "4px",
                            },
                        }}
                    >
                        <List disablePadding>
                            {groupedOptions.map((group, groupIndex) => (
                                <React.Fragment key={group.group || "ungrouped"}>
                                    {groupIndex > 0 && <Divider />}

                                    {/* Group header (only if groupBy is provided and group name exists) */}
                                    {groupBy && group.group && (
                                        <ListItem
                                            component="button"
                                            onClick={() => handleGroupExpand(group.group!)}
                                            disabled={disabled}
                                            sx={{
                                                bgcolor: "rgba(0, 0, 0, 0.03)",
                                                "&:hover": {
                                                    bgcolor: disabled ? undefined : "rgba(0, 0, 0, 0.06)",
                                                },
                                                border: "none",
                                                width: "100%",
                                                textAlign: "left",
                                                cursor: disabled ? "default" : "pointer",
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <Checkbox
                                                    edge="start"
                                                    checked={isGroupSelected(group.options)}
                                                    indeterminate={isGroupPartiallySelected(group.options)}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleGroupToggle(group.options)
                                                    }}
                                                    disabled={disabled || readOnly}
                                                    checkedIcon={<CheckBoxIcon />}
                                                    icon={<CheckBoxOutlineBlankIcon />}
                                                    indeterminateIcon={<IndeterminateCheckBoxIcon />}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {renderGroup ? renderGroup({ group: group.group, children: null }) : group.group}
                                                    </Typography>
                                                }
                                            />
                                            {expandedGroups.includes(group.group) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </ListItem>
                                    )}

                                    {/* Group options */}
                                    <Collapse
                                        in={!groupBy || !group.group || expandedGroups.includes(group.group)}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List disablePadding>
                                            {group.options.map((option) => {
                                                const isSelected = selectedOptions.some((selected) => isOptionEqualToValue(option, selected))

                                                return (
                                                    <ListItem
                                                        key={getOptionKey(option)}
                                                        onClick={() => handleOptionToggle(option)}
                                                        sx={{
                                                            pl: groupBy && group.group ? 4 : 2,
                                                            cursor: disabled || readOnly ? "default" : "pointer",
                                                            "&:hover": {
                                                                bgcolor: disabled || readOnly ? undefined : "rgba(0, 0, 0, 0.04)",
                                                            },
                                                        }}
                                                        dense
                                                    >
                                                        {renderOption ? (
                                                            renderOption({}, option, { selected: isSelected })
                                                        ) : (
                                                            <>
                                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                                    <Checkbox
                                                                        edge="start"
                                                                        checked={isSelected}
                                                                        disabled={disabled || readOnly}
                                                                        checkedIcon={<CheckBoxIcon />}
                                                                        icon={<CheckBoxOutlineBlankIcon />}
                                                                    />
                                                                </ListItemIcon>
                                                                <ListItemText primary={getOptionLabel(option)} />
                                                            </>
                                                        )}
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </Collapse>
                                </React.Fragment>
                            ))}

                            {groupedOptions.every((group) => group.options.length === 0) && (
                                <ListItem>
                                    <ListItemText
                                        primary="No categories found"
                                        primaryTypographyProps={{ align: "center", color: "text.secondary" }}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Box>

                    {/* Toggle All footer */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                            p: 1,
                            bgcolor: "rgba(0, 0, 0, 0.02)",
                        }}
                    >
                        <Box
                            component="button"
                            onClick={selectedOptions.length === options.length ? handleUnselectAll : handleSelectAll}
                            disabled={disabled || readOnly}
                            sx={{
                                background: "none",
                                border: "none",
                                color: disabled ? "text.disabled" : "primary.main",
                                cursor: disabled ? "default" : "pointer",
                                fontSize: "0.875rem",
                                p: 0,
                                textDecoration: disabled ? "none" : "underline",
                                "&:hover": {
                                    color: disabled ? "text.disabled" : "primary.dark",
                                },
                            }}
                        >
                            Toggle All
                        </Box>
                    </Box>
                </Paper>
            </Paper>
        </Box>
    )
}
