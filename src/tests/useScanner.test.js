import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScanner } from '../hooks/useScanner'

// Mock scanner service
vi.mock('../services/scanner', () => ({
    scanMultiple: vi.fn(),
    calculateStatistics: vi.fn()
}))

// Mock exporter service
vi.mock('../services/exporter', () => ({
    exportResults: vi.fn()
}))

import { scanMultiple, calculateStatistics } from '../services/scanner'
import { exportResults } from '../services/exporter'

describe('useScanner Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useScanner())

        expect(result.current.isScanning).toBe(false)
        expect(result.current.progress).toEqual({
            current: 0,
            total: 0,
            percentage: 0
        })
        expect(result.current.results).toEqual([])
        expect(result.current.statistics).toEqual({
            total: 0,
            success: 0,
            failed: 0,
            warning: 0
        })
    })

    it('should start scan and update progress', async () => {
        const mockResults = [
            { url: 'https://ex1.com', status: 'vulnerable' },
            { url: 'https://ex2.com', status: 'safe' }
        ]

        const mockStats = {
            total: 2,
            success: 1,
            failed: 0,
            warning: 1
        }

        scanMultiple.mockImplementation(async (targets, dns, onProgress, _options) => {
            onProgress({ current: 1, total: 2, percentage: 50 })
            onProgress({ current: 2, total: 2, percentage: 100 })
            return mockResults
        })

        calculateStatistics.mockReturnValue(mockStats)

        const { result } = renderHook(() => useScanner())

        await act(async () => {
            await result.current.startScan({
                targets: ['https://ex1.com', 'https://ex2.com'],
                dnsEndpoint: 'test.dns.com',
                demoMode: false
            })
        })

        expect(result.current.isScanning).toBe(false)
        expect(result.current.progress.percentage).toBe(100)
        expect(result.current.results).toEqual(mockResults)
        expect(result.current.statistics).toEqual(mockStats)
    })

    it('should pass custom configuration to scanner', async () => {
        scanMultiple.mockResolvedValue([])
        calculateStatistics.mockReturnValue({ total: 0, success: 0, failed: 0, warning: 0 })

        const { result } = renderHook(() => useScanner())

        await act(async () => {
            await result.current.startScan({
                targets: ['https://example.com'],
                dnsEndpoint: 'test.dns.com',
                demoMode: false,
                requestTimeout: 20,
                maxConcurrentRequests: 50
            })
        })

        expect(scanMultiple).toHaveBeenCalledWith(
            expect.any(Array),
            'test.dns.com',
            expect.any(Function),
            expect.objectContaining({
                demoMode: false,
                timeout: 20000,
                maxConcurrent: 50
            })
        )
    })

    it('should calculate statistics correctly', async () => {
        const mockResults = [
            { status: 'vulnerable' },
            { status: 'vulnerable' },
            { status: 'safe' },
            { status: 'error' }
        ]

        const mockStats = {
            total: 4,
            success: 2,
            failed: 1,
            warning: 1
        }

        scanMultiple.mockResolvedValue(mockResults)
        calculateStatistics.mockReturnValue(mockStats)

        const { result } = renderHook(() => useScanner())

        await act(async () => {
            await result.current.startScan({
                targets: ['url1', 'url2', 'url3', 'url4'],
                dnsEndpoint: 'test.dns.com',
                demoMode: false
            })
        })

        expect(result.current.statistics).toEqual(mockStats)
        expect(calculateStatistics).toHaveBeenCalledWith(mockResults)
    })

    it('should reset scan state', async () => {
        scanMultiple.mockResolvedValue([{ status: 'vulnerable' }])
        calculateStatistics.mockReturnValue({ total: 1, success: 1, failed: 0, warning: 0 })

        const { result } = renderHook(() => useScanner())

        await act(async () => {
            await result.current.startScan({
                targets: ['https://example.com'],
                dnsEndpoint: 'test.dns.com',
                demoMode: false
            })
        })

        act(() => {
            result.current.resetScan()
        })

        expect(result.current.results).toEqual([])
        expect(result.current.progress).toEqual({
            current: 0,
            total: 0,
            percentage: 0
        })
        expect(result.current.statistics).toEqual({
            total: 0,
            success: 0,
            failed: 0,
            warning: 0
        })
    })

    it('should export results as JSON', async () => {
        scanMultiple.mockResolvedValue([{ url: 'test', status: 'vulnerable' }])
        calculateStatistics.mockReturnValue({ total: 1, success: 1, failed: 0, warning: 0 })
        exportResults.mockImplementation(() => { })

        const { result } = renderHook(() => useScanner())

        await act(async () => {
            await result.current.startScan({
                targets: ['https://example.com'],
                dnsEndpoint: 'test.dns.com',
                demoMode: false
            })
        })

        act(() => {
            result.current.exportResults('json')
        })

        expect(exportResults).toHaveBeenCalledWith(
            [{ url: 'test', status: 'vulnerable' }],
            'json'
        )
    })

    it('should export results as CSV', async () => {
        scanMultiple.mockResolvedValue([{ url: 'test', status: 'safe' }])
        calculateStatistics.mockReturnValue({ total: 1, success: 0, failed: 0, warning: 1 })
        exportResults.mockImplementation(() => { })

        const { result } = renderHook(() => useScanner())

        await act(async () => {
            await result.current.startScan({
                targets: ['https://example.com'],
                dnsEndpoint: 'test.dns.com',
                demoMode: false
            })
        })

        act(() => {
            result.current.exportResults('csv')
        })

        expect(exportResults).toHaveBeenCalledWith(
            [{ url: 'test', status: 'safe' }],
            'csv'
        )
    })

    it('should not export when no results', () => {
        const { result } = renderHook(() => useScanner())

        act(() => {
            // Ensure results is empty
            expect(result.current.results).toEqual([])
            result.current.exportResults('json')
        })

        expect(exportResults).not.toHaveBeenCalled()
    })
})
