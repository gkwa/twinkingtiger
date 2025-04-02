# TwinkingTiger Extension justfile
# Run with 'just <command>'

# Default recipe to display help
default:
    @just --list

# Install dependencies
install:
    pnpm install

# Clean build directory
clean:
    rm -rf dist

# Develop with hot reload
dev:
    pnpm dev

# Build the extension for production
build:
    pnpm build
    node build.js
    node create-icons.js

# Build with source maps for debugging
build-debug:
    VITE_DEBUG=true pnpm build
    node build.js
    node create-icons.js

# Create icons
create-icons:
    node create-icons.js

# Lint code
lint:
    pnpm lint

# Format code
format:
    pnpm format
