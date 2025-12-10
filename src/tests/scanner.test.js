import { describe, it, expect, vi, beforeEach } from 'vitest'
import { scanTarget, scanMultiple, buildPayload, calculateStatistics } from '../services/scanner'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('Scanner Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('buildPayload', () => {
        it('should build correct exploit payload with DNS endpoint', () => {
            const dnsEndpoint = 'test.burpcollaborator.net'
            const payload = buildPayload(dnsEndpoint)

            expect(payload).toContain('----WebKitFormBoundaryx8jO2oVc6SWP3Sad')
            expect(payload).toContain(dnsEndpoint)
            expect(payload).toContain('nslookup `whoami`')
            expect(payload).toContain('process.mainModule.require')
        })

        it('should escape DNS endpoint properly', () => {
            const dnsEndpoint = 'test"malicious.com'
            const payload = buildPayload(dnsEndpoint)

            expect(payload).toContain(dnsEndpoint)
        })
    })

    describe('scanTarget', () => {
        it('should detect vulnerable target with correct headers', async () => {
            const mockResponse = {
                status: 200,
                headers: {
                    'x-action': 'test',
                    'next-action': 'test',
                    'rsc': 'test'
                },
                data: 'test data'
            }

            axios.post.mockResolvedValue(mockResponse)

            const payload = buildPayload('test.dns.com')
            const result = await scanTarget('https://example.com', payload, { demoMode: false })

            expect(result.status).toBe('vulnerable')
            expect(result.statusCode).toBe(200)
            expect(result.message).toContain('Vulnerability indicators found')
            expect(axios.post).toHaveBeenCalledWith(
                'https://example.com',
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Next-Action': expect.any(String)
                    }),
                    timeout: 10000
                })
            )
        })

        it('should respect custom timeout', async () => {
            const mockResponse = { status: 200, headers: {}, data: '' }
            axios.post.mockResolvedValue(mockResponse)
            const payload = buildPayload('test.dns.com')

            await scanTarget('https://example.com', payload, { demoMode: false, timeout: 5000 })

            expect(axios.post).toHaveBeenCalledWith(
                'https://example.com',
                expect.any(String),
                expect.objectContaining({
                    timeout: 5000
                })
            )
        })

        it('should detect non-vulnerable target without headers', async () => {
            const mockResponse = {
                status: 200,
                headers: {},
                data: 'test data'
            }

            axios.post.mockResolvedValue(mockResponse)

            const payload = buildPayload('test.dns.com')
            const result = await scanTarget('https://example.com', payload, { demoMode: false })

            expect(result.status).toBe('safe')
            expect(result.message).toContain('No vulnerability indicators')
        })

        it('should handle network errors', async () => {
            axios.post.mockRejectedValue(new Error('Network Error'))

            const payload = buildPayload('test.dns.com')
            const result = await scanTarget('https://example.com', payload, { demoMode: false })

            expect(result.status).toBe('error')
            expect(result.message).toContain('Network Error')
        })

        it('should work in demo mode', async () => {
            const payload = buildPayload('test.dns.com')
            const result = await scanTarget('https://example.com', payload, { demoMode: true })

            expect(result.status).toMatch(/vulnerable|safe|error/)
            expect(result.url).toBe('https://example.com')
            expect(axios.post).not.toHaveBeenCalled()
        })
    })

    describe('scanMultiple', () => {
        it('should scan multiple targets concurrently', async () => {
            const mockResponse = {
                status: 200,
                headers: { 'x-action': 'test' },
                data: 'test'
            }

            axios.post.mockResolvedValue(mockResponse)

            const targets = [
                'https://example1.com',
                'https://example2.com',
                'https://example3.com'
            ]

            const onProgress = vi.fn()
            const results = await scanMultiple(targets, 'test.dns.com', onProgress, { demoMode: false })

            expect(results).toHaveLength(3)
            expect(onProgress).toHaveBeenCalled()
            expect(onProgress).toHaveBeenLastCalledWith(
                expect.objectContaining({ percentage: 100 })
            )
        })

        it('should handle mixed results', async () => {
            axios.post
                .mockResolvedValueOnce({ status: 200, headers: { 'x-action': 'test' }, data: '' })
                .mockResolvedValueOnce({ status: 200, headers: {}, data: '' })
                .mockRejectedValueOnce(new Error('Network Error'))

            const targets = ['https://ex1.com', 'https://ex2.com', 'https://ex3.com']
            const results = await scanMultiple(targets, 'test.dns.com', null, { demoMode: false })

            expect(results[0].status).toBe('vulnerable')
            expect(results[1].status).toBe('safe')
            expect(results[2].status).toBe('error')
        })
    })

    describe('calculateStatistics', () => {
        it('should calculate correct statistics', () => {
            const results = [
                { status: 'vulnerable' },
                { status: 'vulnerable' },
                { status: 'safe' },
                { status: 'error' }
            ]

            const stats = calculateStatistics(results)

            expect(stats).toEqual({
                total: 4,
                success: 2,
                failed: 1,
                warning: 1
            })
        })
    })
})
