import { useState, useRef } from 'react'

import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
  Typography,
} from '@material-ui/core'
import { experimentalStyled } from '@material-ui/core/styles'

import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import MoreVertTwoToneIcon from '@material-ui/icons/MoreVertTwoTone'

const ButtonError = experimentalStyled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `,
)

function BulkActions() {
  const [onMenuOpen, menuOpen] = useState<boolean>(false)
  const moreRef = useRef<HTMLButtonElement | null>(null)

  const openMenu = (): void => {
    menuOpen(true)
  }

  const closeMenu = (): void => {
    menuOpen(false)
  }

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          {/* <ButtonError
            sx={{ ml: 1 }}
            startIcon={<DeleteTwoToneIcon />}
            variant="contained"
          >
            Delete
          </ButtonError> */}
          <DeleteTwoToneIcon />
        </Box>
        {/* <IconButton
          color="primary"
          onClick={openMenu}
          ref={moreRef}
          sx={{ ml: 2, p: 1 }}
        >
          <MoreVertTwoToneIcon />
        </IconButton> */}
      </Box>

      <Menu
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <List sx={{ p: 1 }} component="nav">
          <ListItem button>
            <ListItemText primary="Bulk delete selected" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Bulk edit selected" />
          </ListItem>
        </List>
      </Menu>
    </>
  )
}

export default BulkActions