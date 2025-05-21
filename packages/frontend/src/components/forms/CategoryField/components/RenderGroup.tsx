import { Checkbox, Collapse, Typography, Box, ListSubheader } from '@mui/material'
import type { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import type React from 'react'
import type { IAccount } from '@angelfish/core'
/**
 * Props used to render a grouped section in a multi-select Autocomplete component.
 * Typically used when customizing the `renderGroup` method of MUI's Autocomplete.
 */
type RenderGroupProps = {
    /**
     * Parameters provided by the Autocomplete component for rendering a group.
     * Includes the group name (`group`), the rendered options (`children`),
     * and other internal metadata used for rendering.
     */
    params: AutocompleteRenderGroupParams;

    /**
     * A record indicating whether each group is currently collapsed (hidden).
     * Keys are group names, and values are booleans where `true` means the group is collapsed.
     */
    collapsedGroups: Record<string, boolean>;

    /**
     * The visual style or mode of the Autocomplete (e.g., 'compact', 'default', etc.).
     * Can be used to conditionally render UI based on design variants.
     */
    variant: string;

    /**
     * The currently selected accounts from the Autocomplete list.
     */
    selected: IAccount[];

    /**
     * State setter for toggling collapsed state of each group.
     */
    setCollapsedGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

    /**
     * State setter for updating the selected accounts.
     */
    setSelected: React.Dispatch<React.SetStateAction<IAccount[]>>;

    /**
     * A sorted list of all accounts used for rendering the options in the group.
     * Typically used to maintain a consistent order.
     */
    sortedAccounts: IAccount[];
};

export const RenderGroup: React.FC<RenderGroupProps> = ({ variant, params, collapsedGroups, selected, setCollapsedGroups, setSelected, sortedAccounts }) => {

    // handling collapsing and expanding the group
    const handleGroupToggle = (group: string) => {
        setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }))
    }
    // handling the case when the user selects/de-select a group checkbox
    const handleGroupSelect = (groupName: string, checked: boolean) => {
        if (groupName === 'Account Transfer') {
            const groupOptions = sortedAccounts?.filter(
                (o: IAccount) => o?.class === "ACCOUNT",
            )
            if (checked) {
                // Add all from group if not already selected
                const toAdd = groupOptions.filter(
                    (item: IAccount) => !selected.some((s) => s.id === item.id),
                )
                setSelected([...selected, ...toAdd])
            } else {
                // Remove all from group
                setSelected(selected.filter((item) => item.class !== 'ACCOUNT'))
            }
        } else {
            const groupOptions: IAccount[] = sortedAccounts.filter(
                (o: IAccount) => o?.categoryGroup?.name === groupName,
            )

            if (checked) {
                // Add all from group if not already selected
                const toAdd = groupOptions.filter(
                    (item: IAccount) => !selected.some((s) => s.name === item.name),
                )
                setSelected([...selected, ...toAdd])
            } else {
                // Remove all from group
                setSelected(selected.filter((item) => item.categoryGroup?.name !== groupName))
            }
        }
    }
    // handling the case when the user selects an option for group checkbox
    const isGroupChecked = (groupName: string) => {
        if (groupName === 'Account Transfer') {
            const groupOptions = sortedAccounts?.filter(
                (o: IAccount) => o?.class === "ACCOUNT",
            )
            return groupOptions.every((item) => selected.some((s) => s.id === item.id))
        }
        const groupOptions = sortedAccounts?.filter(
            (o: IAccount) => o?.categoryGroup?.name === groupName,
        )
        return groupOptions.every((item) => selected.some((s) => s.name === item.name))
    }
    // handling the case when the user selects an option for sub-group checkbox
    const isSubGroupChecked = (groupName: string) => {
        if (groupName === 'Account Transfer') {
            const groupOptions = sortedAccounts?.filter(
                (o: IAccount) => o?.class === "ACCOUNT",
            )
            const someSelected = groupOptions.some((item) =>
                selected?.some((o) => o.name === item.name)
            );

            const allSelected = groupOptions.every((item) =>
                selected?.some((o) => o.name === item.name)
            );
            return someSelected && !allSelected
        }
        const groupOptions = sortedAccounts?.filter(
            (o: IAccount) => o?.categoryGroup?.name === groupName,
        )
        const someSelected = groupOptions.some((item) =>
            selected?.some((o) => o.name === item.name)
        );

        const allSelected = groupOptions.every((item) =>
            selected?.some((o) => o.name === item.name)
        );
        return someSelected && !allSelected
    }

    // Rendering the group
    // If the variant is 'multi-box', we render a collapsible box with a checkbox
    if (variant === 'multi-box') {
        const isCollapsed = collapsedGroups[params.group] ?? false
        return (
            <Box key={params.key}>
                <Box
                    display="flex"
                    alignItems="center"
                    px={2}
                    py={1}
                    sx={{ backgroundColor: '#f5f5f5', cursor: 'pointer' }}
                    onClick={() => handleGroupToggle(params.group)}
                >
                    {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    <Box display="flex" alignItems="center">
                        <Checkbox
                            size="small"
                            checked={isGroupChecked(params.group)}
                            indeterminate={isSubGroupChecked(params.group)}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleGroupSelect(params.group, !isGroupChecked(params.group))
                            }}
                        />
                        <Typography variant="subtitle2">{params.group}</Typography>
                    </Box>
                </Box>
                <Collapse in={!isCollapsed}>{params.children}</Collapse>
            </Box>

        )
    }
    if (!params.group) {
        return [params.children]
    }
    return [
        <ListSubheader key={params.key} component="div">
            {params.group}
        </ListSubheader>,
        params.children,
    ]
}

export default RenderGroup;
