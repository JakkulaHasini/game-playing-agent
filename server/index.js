const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple game agent: returns a random valid move for Tic-Tac-Toe
// Request body: { board: Array(9) with 'X' | 'O' | null, player: 'X' | 'O' }
app.post('/api/agent/move', (req, res) => {
  const { board, player } = req.body || {};
  if (!Array.isArray(board) || board.length !== 9 || (player !== 'X' && player !== 'O')) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const emptyIndices = board
    .map((value, index) => (value === null || value === '' ? index : null))
    .filter((idx) => idx !== null);

  if (emptyIndices.length === 0) {
    return res.json({ move: -1, message: 'Board full' });
  }

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  res.json({ move: randomIndex, player });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


