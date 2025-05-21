import { autocompleteClasses, Box, Popper, styled } from "@mui/material";
import type { ReactNode } from "react";
import { forwardRef } from "react";

export const CustomPopper = styled(Popper)(({ theme }) => ({
    [`& .${autocompleteClasses.paper}`]: {
        paddingBottom: theme.spacing(6),
    },
}));

// Custom Listbox with footer button
type CustomListboxProps = {
    children?: ReactNode;
    button?: ReactNode;
}
export const CustomListbox = forwardRef(function CustomListbox(props: CustomListboxProps, ref) {
    const { children, ...rest } = props;

    return (
        <Box
            ref={ref}
            {...rest}
            sx={{
                maxHeight: 300, // Set max height for entire dropdown
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Scrollable options list */}
            <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {children}
            </Box>

            {/* Sticky footer button */}
            <Box
                sx={{
                    borderTop: '1px solid #ccc',
                    p: 1,
                    backgroundColor: 'background.paper',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {props.button}
            </Box>
        </Box>
    );
});