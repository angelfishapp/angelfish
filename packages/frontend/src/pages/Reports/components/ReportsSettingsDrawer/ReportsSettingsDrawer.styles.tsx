import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { AccordionProps } from '@mui/material/Accordion'
import Accordion from '@mui/material/Accordion'
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import AccordionSummary from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'

/**
 * Styled Accordion
 */
export const StyledAccordion = styled((props: AccordionProps) => (
  <Accordion
    disableGutters
    square
    defaultExpanded
    slotProps={{ root: { elevation: 0 } }}
    {...props}
  />
))(() => ({}))

/**
 * Styled Accordion Summary
 */
export const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary expandIcon={<ExpandMoreIcon />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}))
