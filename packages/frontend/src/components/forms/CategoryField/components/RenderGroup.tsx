import { Checkbox, Collapse, Typography, Box, ListSubheader } from '@mui/material'
import type { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import React from 'react'
import { IAccount } from '@angelfish/core'

/**
 * Props used to render a grouped section in a multi-select Autocomplete component.
 */
type RenderGroupProps = {
    /**
     * Parameters passed by the Autocomplete component for rendering a group.
     * Includes group name, children, and other internal values.
     */
    params: AutocompleteRenderGroupParams;

    /**
     * state for the group is currently collapsed or not (i.e., hidden from view).
     */
    collapsedGroups: Record<string, boolean>;

    // /**
    //  * Toggles the collapsed/expanded state of the group.
    //  *
    //  * @param group - The name of the group to toggle.
    //  */
    // handleGroupToggle: (group: string) => void;

    // /**
    //  * Checks whether all items in the specified group are currently selected.
    //  *
    //  * @param groupName - The name of the group to check.
    //  * @returns True if all items in the group are selected; false otherwise.
    //  */
    // isGroupChecked: (groupName: string) => void;

    // /**
    //  * Handles selecting or deselecting all items in a specific group.
    //  *
    //  * @param groupName - The name of the group.
    //  * @param checked - Whether the group should be selected (true) or deselected (false).
    //  */
    // handleGroupSelect: (groupName: string, checked: boolean) => void;
    /**
     * The current variant of selected account options.
     */
    variant: string;

    selected: IAccount[];
    setCollapsedGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setSelected: React.Dispatch<React.SetStateAction<IAccount[]>>;
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
