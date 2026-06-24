import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

interface MetricsCardProps {
  title: string
  value: string
  status: 'success' | 'warning' | 'error' | 'info'
  change?: string
}

export default function MetricsCard({ title, value, status, change }: MetricsCardProps) {
  const statusColors = {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  }

  const isTrending = change && (change.includes('+') || change.includes('-'))
  const isNegative = change?.includes('-')

  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="caption">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ my: 1 }}>
          {value}
        </Typography>
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isNegative ? (
              <TrendingDownIcon sx={{ color: '#4caf50', fontSize: 18 }} />
            ) : (
              <TrendingUpIcon sx={{ color: '#f44336', fontSize: 18 }} />
            )}
            <Chip
              label={change}
              size="small"
              sx={{
                bgcolor: statusColors[status],
                color: 'white',
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
