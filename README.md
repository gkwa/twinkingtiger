# TwinkingTiger Chrome Extension

A Chrome extension that cycles through tabs with configurable timing and rounds.

## Features

- Automatically cycle through all tabs in the current window
- Configure time spent on each tab
- Set number of rounds (including infinite cycling)
- Start and stop cycling at any time

## Development

This project uses:

- Vite for building
- pnpm for package management
- just for task automation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [pnpm](https://pnpm.io/installation)
- [just](https://github.com/casey/just#installation)

### Setup

```bash
# Install dependencies
just install

# Start development server
just dev

# Build the extension
just build

# Build with source maps for debugging
just build-debug

# Format code
just format

# Lint code
just lint
```

## Installation in Chrome

1. Build the extension with `just build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `dist` folder
5. The extension is now installed and can be accessed from the toolbar

## Usage

1. Click the TwinkingTiger icon in the Chrome toolbar
2. Set the time per tab (in seconds)
3. Set the number of rounds (0 for infinite cycling)
4. Click "Start Cycling" to begin
5. The extension will cycle through all tabs in the current window
6. Click "Stop Cycling" to stop the cycling at any time
