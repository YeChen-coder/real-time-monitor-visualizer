# Real-Time Window Visualizer

A real-time window detection and visualization system for OBS streaming, built with Python backend and React frontend in a monorepo structure.

## Project Structure

```
real-time-visualizer/
├── apps/
│   ├── frontend/          # React + Vite + TypeScript
│   └── backend/           # Python window detection
├── docs/                  # Documentation and planning
└── package.json          # Monorepo configuration
```

## Prerequisites

- **Node.js**: >= 16.0.0
- **Python**: >= 3.8.0  
- **Git**: For version control
- **Windows OS**: Required for window detection

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd real-time-visualizer
npm run install:all
```

### 2. Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173 (React app)
- **Backend**: Python console application

### 3. Individual Development

Run frontend only:
```bash
npm run dev:frontend
```

Run backend only:
```bash
npm run dev:backend
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start React development server |
| `npm run dev:backend` | Start Python backend |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build frontend for production |
| `npm run clean` | Remove all node_modules and build artifacts |

## Development Workflow

1. **Setup**: Run `npm run install:all` once
2. **Development**: Use `npm run dev` for concurrent development
3. **Testing**: Individual apps can be tested separately
4. **Building**: Use `npm run build` for production builds

## Project Status

- ✅ **Story 1.1**: Monorepo & Project Scaffolding (Complete)
- 🔄 **Story 1.2**: Python Backend - Window Detection (Pending)
- 🔄 **Story 1.3**: Backend WebSocket Server (Pending)
- 🔄 **Story 1.4**: Frontend WebSocket Client (Pending)
- 🔄 **Story 1.5**: Browser Differentiation (Pending)

## Architecture

- **Backend**: Python-based window detection with WebSocket server
- **Frontend**: React application for real-time visualization
- **Communication**: WebSocket connection for real-time data
- **Styling**: "Frosted glass" morphism aesthetic (planned)

## Next Steps

1. Implement window detection in Python backend
2. Add WebSocket communication layer
3. Build React frontend with real-time updates
4. Add visual polish and animations

---

For detailed documentation, see the `docs/` directory.