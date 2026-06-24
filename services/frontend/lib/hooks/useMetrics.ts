'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Metrics {
  cpu: number
  memory: number
  disk: number
  responseTime: number
  errorRate: number
  uptime: number
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/metrics/current`
        )
        setMetrics(response.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
        setMetrics({
          cpu: 45,
          memory: 62,
          disk: 72,
          responseTime: 245,
          errorRate: 0.02,
          uptime: 99.98,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  return { metrics, loading, error }
}
