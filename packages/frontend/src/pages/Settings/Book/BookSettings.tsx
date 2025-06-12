import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { UserTableContainer } from '@/containers/UserTableContainer'
import { useGetBook, useSaveBook } from '@/hooks'
import type { IBook } from '@angelfish/core'
import BookForm from './components/BookForm'

/**
 * Main Component
 */

export default function BookSettings() {
  // Component State
  const { book } = useGetBook()
  const bookSaveMutation = useSaveBook()

  // Render
  return (
    <>
      <BookForm
        book={book as IBook}
        onSave={(updatedBook) => {
          bookSaveMutation.mutate(updatedBook)
        }}
      />

      <Box marginBottom={2}>
        <Paper>
          <Typography variant="h5" gutterBottom={true}>
            Household Members
          </Typography>
          <UserTableContainer />
        </Paper>
      </Box>
    </>
  )
}
