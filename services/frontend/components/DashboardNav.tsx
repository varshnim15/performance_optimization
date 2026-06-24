'use client'

import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StorageIcon from '@mui/icons-material/Storage'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import SmartToyIcon from '@mui/icons-material/SmartToy'

const DRAWER_WIDTH = 260

export default function DashboardNav() {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#1a1a2e',
          color: 'white',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#1976d2' }}>PO</Avatar>
        <Box>
          <Typography variant="subtitle2">Performance</Typography>
          <Typography variant="caption" color="textSecondary">Optimizer</Typography>
        </Box>
      </Box>

      <Divider />

      <List>
        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Executive Dashboard" />
        </ListItem>

        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Application" />
        </ListItem>

        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Database" />
        </ListItem>

        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}>
            <NetworkCheckIcon />
          </ListItemIcon>
          <ListItemText primary="Network" />
        </ListItem>

        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}>
            <SmartToyIcon />
          </ListItemIcon>
          <ListItemText primary="AI Insights" />
        </ListItem>

        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  )
}
