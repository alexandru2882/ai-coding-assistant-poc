# AI Coding Assistant - POC

An AI-powered coding assistant with dual-AI architecture that asks clarifying questions before generating code.

## Features

- 🤖 Dual-AI system (conversational + code generation)
- 💬 Interactive chat interface
- 🖥️ Integrated code editor (Monaco)
- ▶️ Sandboxed code execution
- 🎨 Dark theme UI
- 🔧 Multi-language support

## Quick Start

### Prerequisites

- Node.js v18+
- pnpm
- API keys (OpenAI, Anthropic, E2B)

### Installation

```bash
git clone https://github.com/alexandru2882/ai-coding-assistant-poc
cd ai-coding-assistant-poc
pnpm install
cp .env.example .env.local
# Add your API keys to .env.local
pnpm run dev
```

### Usage

1. Open http://localhost:3000
2. Describe what you want to build
3. Answer clarification questions
4. Review generated code
5. Run and test code

## Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run linter
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format

# Check formatting
pnpm run format:check
```

## Project Structure

```
src/
├── agents/          # AI agent implementations
├── components/      # React components
├── services/        # External service integrations
├── store/           # State management (Zustand)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## License

MIT
