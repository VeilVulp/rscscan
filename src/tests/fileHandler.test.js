import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fileHandler, isElectron } from '../services/fileHandler'

describe('FileHandler Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        delete window.electronAPI
    })

    describe('isElectron', () => {
        it('should return false when electronAPI is not available', () => {
            expect(isElectron()).toBeFalsy()
        })

        it('should return true when electronAPI is available', () => {
            window.electronAPI = { isElectron: true }
            expect(isElectron()).toBeTruthy()
        })
    })

    describe('selectFile (Web Mode)', () => {
        it('should use web File API when not in Electron', async () => {
            // Create a proper mock File with text() method
            const mockFileContent = 'test content'
            const mockFile = {
                name: 'test.txt',
                text: vi.fn().mockResolvedValue(mockFileContent)
            }

            // Mock file input
            const createElementSpy = vi.spyOn(document, 'createElement')
            const mockInput = {
                type: '',
                accept: '',
                click: vi.fn(),
                onchange: null
            }

            createElementSpy.mockReturnValue(mockInput)

            // Start the file selection
            const selectPromise = fileHandler.selectFile()

            // Wait a bit for the input to be created
            await new Promise(resolve => setTimeout(resolve, 10))

            // Simulate file selection
            if (mockInput.onchange) {
                const event = { target: { files: [mockFile] } }
                await mockInput.onchange(event)
            }

            const result = await selectPromise

            expect(result).toBeDefined()
            expect(result.name).toBe('test.txt')
            expect(result.content).toBe('test content')

            createElementSpy.mockRestore()
        })
    })

    describe('selectFile (Electron Mode)', () => {
        it('should use native file picker in Electron', async () => {
            const mockResult = {
                path: '/path/to/file.txt',
                content: 'file content',
                name: 'file.txt'
            }

            window.electronAPI = {
                isElectron: true,
                selectFile: vi.fn().mockResolvedValue(mockResult)
            }

            const result = await fileHandler.selectFile()

            expect(window.electronAPI.selectFile).toHaveBeenCalled()
            expect(result).toEqual(mockResult)
        })
    })

    describe('saveFile', () => {
        it('should download file in web mode', async () => {
            const createElementSpy = vi.spyOn(document, 'createElement')
            const mockLink = {
                href: '',
                download: '',
                style: { display: '' },
                click: vi.fn()
            }
            createElementSpy.mockReturnValue(mockLink)

            const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => { })
            const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => { })

            const result = await fileHandler.saveFile('test data', 'test.json')

            expect(result).toBe('test.json')
            expect(mockLink.click).toHaveBeenCalled()
            expect(appendChildSpy).toHaveBeenCalled()
            expect(removeChildSpy).toHaveBeenCalled()
        })

        it('should use native save dialog in Electron', async () => {
            window.electronAPI = {
                isElectron: true,
                saveFile: vi.fn().mockResolvedValue('/path/to/saved/file.json')
            }

            const result = await fileHandler.saveFile('test data', 'test.json')

            expect(window.electronAPI.saveFile).toHaveBeenCalledWith('test data', 'test.json')
            expect(result).toBe('/path/to/saved/file.json')
        })
    })

    describe('getVersion', () => {
        it('should return web version when not in Electron', async () => {
            const version = await fileHandler.getVersion()
            expect(version).toContain('Web')
        })

        it('should return Electron version when in Electron', async () => {
            window.electronAPI = {
                isElectron: true,
                getVersion: vi.fn().mockResolvedValue('1.0.0')
            }

            const version = await fileHandler.getVersion()
            expect(version).toBe('1.0.0')
        })
    })

    describe('openExternal', () => {
        it('should open URL in new window in web mode', async () => {
            const openSpy = vi.spyOn(window, 'open').mockImplementation(() => { })

            await fileHandler.openExternal('https://example.com')

            expect(openSpy).toHaveBeenCalledWith(
                'https://example.com',
                '_blank',
                'noopener,noreferrer'
            )
        })

        it('should use shell.openExternal in Electron', async () => {
            window.electronAPI = {
                isElectron: true,
                openExternal: vi.fn().mockResolvedValue({ success: true })
            }

            await fileHandler.openExternal('https://example.com')

            expect(window.electronAPI.openExternal).toHaveBeenCalledWith('https://example.com')
        })
    })

    describe('showNotification', () => {
        it('should use Web Notifications API', async () => {
            const NotificationSpy = vi.fn()
            global.Notification = NotificationSpy
            global.Notification.permission = 'granted'

            await fileHandler.showNotification('Test Title', 'Test Body')

            expect(NotificationSpy).toHaveBeenCalledWith('Test Title', { body: 'Test Body' })
        })

        it('should request permission if not granted', async () => {
            global.Notification = vi.fn()
            global.Notification.permission = 'default'
            global.Notification.requestPermission = vi.fn().mockResolvedValue('granted')

            await fileHandler.showNotification('Test', 'Body')

            expect(global.Notification.requestPermission).toHaveBeenCalled()
        })
    })
})
