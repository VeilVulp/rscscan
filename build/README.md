# CVE-2025-55182 Scanner Icon

This directory contains application icons for different platforms.

## Icon Files

- `icon.png` (512x512) - Source icon for all platforms
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon

## Generating Icons

You can use tools like:
- **electron-icon-builder**: `npm install -g electron-icon-builder && electron-icon-builder --input=./icon.png --output=./`
- **Online tools**: https://www.icoconverter.com/
- **ImageMagick**: `convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico`

## Icon Requirements

- **PNG**: 512x512px, transparent background
- **ICO**: Multi-resolution (16, 32, 48, 64, 128, 256)
- **ICNS**: Multi-resolution for macOS

## Current Status

⚠️ **Placeholder icons** - Replace with actual application icons before building for production.

For now, create a simple icon with a shield symbol representing security/vulnerability scanning.
