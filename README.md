## Game Playing Agent

Full-stack starter with a simple Tic-Tac-Toe agent.

### Tech
- Backend: Node.js + Express (server)
- Frontend: React + Vite (client)
- Deploy: Render (via `render.yaml` Blueprint)

### Local Development
1. Start backend:
   - `cd server`
   - `npm run dev` (listens on http://localhost:5000)
2. Start frontend:
   - `cd ../client`
   - `npm run dev`

Frontend uses `VITE_API_BASE` (defaults to `http://localhost:5000` if not set).

### Deploy on Render
1. Push this repository to GitHub
2. In Render, create a new Blueprint from your GitHub repo. Render will detect `render.yaml` and provision:
   - Web Service: `game-agent-backend`
   - Static Site: `game-agent-frontend`
3. Once deployed, open the Static Site URL to try the app. The frontend reads `VITE_API_BASE` from the backend service URL.

### API
- POST `/api/agent/move` → `{ board: (9-length array), player: 'X'|'O' }` returns `{ move, player }`.

