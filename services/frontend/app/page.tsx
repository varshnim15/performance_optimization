'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DashboardNav from '@/components/DashboardNav'
import MetricsCard from '@/components/MetricsCard'
import AlertsList from '@/components/AlertsList'
import { useMetrics } from '@/lib/hooks/useMetrics'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0)
  const { metrics, loading, error } = useMetrics()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const sampleChartData = [
    { time: '00:00', cpu: 35, memory: 45, disk: 20 },
    { time: '04:00', cpu: 42, memory: 52, disk: 22 },
    { time: '08:00', cpu: 38, memory: 48, disk: 25 },
    { time: '12:00', cpu: 65, memory: 72, disk: 35 },
    { time: '16:00', cpu: 58, memory: 68, disk: 40 },
    { time: '20:00', cpu: 45, memory: 55, disk: 38 },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardNav />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Performance Optimizer Dashboard
            </Typography>
            <Typography variant="body2">
              Last update: {new Date().toLocaleTimeString()}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Executive Dashboard" />
              <Tab label="Application Metrics" />
              <Tab label="Database Performance" />
              <Tab label="Network Monitoring" />
              <Tab label="Infrastructure" />
              <Tab label="AI Insights" />
            </Tabs>
          </Box>

          {/* Executive Dashboard */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="System Uptime"
                  value="99.98%"
                  status="success"
                  change="+0.02%"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Avg Response Time"
                  value="245ms"
                  status="warning"
                  change="+15ms"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Active Alerts"
                  value="3"
                  status="error"
                  change="2 critical"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="MTTR"
                  value="12min"
                  status="success"
                  change="-30%"
                />
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Resource Utilization Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sampleChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="memory" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="disk" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <AlertsList />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Application Metrics */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Response Time"
                  value="245ms"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Error Rate"
                  value="0.02%"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Throughput"
                  value="5.2k req/s"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Active Sessions"
                  value="1,234"
                  status="success"
                />
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    HTTP Status Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { status: '200', count: 8500 },
                      { status: '201', count: 1200 },
                      { status: '400', count: 45 },
                      { status: '404', count: 15 },
                      { status: '500', count: 5 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Database Performance */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Slow Queries"
                  value="12"
                  status="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Query Latency"
                  value="145ms"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Connection Pool"
                  value="85/100"
                  status="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Replication Lag"
                  value="0.5s"
                  status="success"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Network Monitoring */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Latency"
                  value="12ms"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Packet Loss"
                  value="0.01%"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Throughput"
                  value="8.5Gbps"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="DNS Issues"
                  value="0"
                  status="success"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Infrastructure */}
          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="CPU Utilization"
                  value="45%"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Memory Utilization"
                  value="62%"
                  status="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Disk Usage"
                  value="72%"
                  status="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricsCard
                  title="Running Processes"
                  value="245"
                  status="success"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* AI Insights */}
          <TabPanel value={tabValue} index={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🤖 AI Root Cause Analysis
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      <strong>Predicted Issue:</strong> Database connection pool exhaustion in 8 minutes
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      <strong>Confidence:</strong> 94%
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress variant="determinate" value={94} />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      <strong>Recommended Actions:</strong>
                      <ul>
                        <li>Increase connection pool from 100 to 150</li>
                        <li>Optimize slow queries (avg 2.5s execution time)</li>
                        <li>Enable connection pooling optimization</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📊 Anomaly Detection
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      <strong>Detected Anomalies:</strong>
                      <ul>
                        <li>Memory spike at 14:30 (85% utilization) - Outlier detected</li>
                        <li>Network latency increase by 340% in last 10 minutes</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Container>
      </Box>
    </Box>
  )
}
