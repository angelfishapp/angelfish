import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'

import { UserTableContainer } from '@/containers/UserTableContainer'
import { saveBook } from '@/redux/app/actions'
import { selectBook } from '@/redux/app/selectors'
import type { IBook } from '@angelfish/core'
import BookForm from './components/BookForm'

/**
 * Main Component
 */

export default function BookSettings() {
  const dispatch = useDispatch()

  // Component State
  const book = useSelector(selectBook)

  // Render
  return (
    <>
      <BookForm
        book={book as IBook}
        onSave={(updatedBook) => {
          dispatch(saveBook({ book: updatedBook }))
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
