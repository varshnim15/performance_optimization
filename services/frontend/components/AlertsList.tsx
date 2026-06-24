import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Box } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'

interface Alert {
  id: string
  title: string
  message: string
  severity: 'error' | 'warning' | 'info'
  timestamp: string
  confidence?: string
}

const sampleAlerts: Alert[] = [
  {
    id: '1',
    title: 'Database Connection Pool Critical',
    message: 'Connection pool utilization at 92%, predicted exhaustion in 8 minutes',
    severity: 'error',
    timestamp: '2 minutes ago',
    confidence: '94%',
  },
  {
    id: '2',
    title: 'Memory Anomaly Detected',
    message: 'Unusual memory spike detected on app-server-02',
    severity: 'warning',
    timestamp: '5 minutes ago',
    confidence: '87%',
  },
  {
    id: '3',
    title: 'Network Latency Increase',
    message: 'Network latency increased by 340% in the last 10 minutes',
    severity: 'warning',
    timestamp: '7 minutes ago',
    confidence: '91%',
  },
  {
    id: '4',
    title: 'Slow Query Detected',
    message: 'Query execution time exceeds SLA threshold',
    severity: 'info',
    timestamp: '12 minutes ago',
    confidence: '85%',
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'error':
      return '#f44336'
    case 'warning':
      return '#ff9800'
    case 'info':
      return '#2196f3'
    default:
      return '#9e9e9e'
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'error':
      return <ErrorIcon />
    case 'warning':
      return <WarningIcon />
    default:
      return <InfoIcon />
  }
}

export default function AlertsList() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔔 Active Alerts
        </Typography>
        <List>
          {sampleAlerts.map((alert) => (
            <ListItem
              key={alert.id}
              sx={{
                borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                mb: 1,
                bgcolor: 'background.default',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, color: getSeverityColor(alert.severity) }}>
                {getSeverityIcon(alert.severity)}
              </Box>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {alert.title}
                    {alert.confidence && (
                      <Chip
                        label={alert.confidence}
                        size="small"
                        sx={{
                          bgcolor: getSeverityColor(alert.severity),
                          color: 'white',
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                      {alert.timestamp}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
