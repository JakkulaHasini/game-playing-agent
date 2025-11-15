import { useMemo, useState } from 'react';
import './App.css';

const initialBoard = Array(9).fill(null);

// Helper function to check for a winner
const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Helper function to check if the board is full
const isBoardFull = (board) => {
  return board.every(cell => cell !== null);
};

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [player, setPlayer] = useState('X');
  const [loading, setLoading] = useState(false);
  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE || 'http://localhost:5000', []);
  
  // Calculate game state
  const winner = useMemo(() => checkWinner(board), [board]);
  const isDraw = useMemo(() => !winner && isBoardFull(board), [board, winner]);
  const gameOver = winner || isDraw;

  const handleCellClick = (idx) => {
    if (board[idx] || loading || gameOver) return;
    const next = [...board];
    next[idx] = player;
    setBoard(next);
  };

  const requestAgentMove = async () => {
    if (gameOver) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/agent/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board, player: player === 'X' ? 'O' : 'X' })
      });
      const data = await res.json();
      if (typeof data.move === 'number' && data.move >= 0) {
        const next = [...board];
        next[data.move] = player === 'X' ? 'O' : 'X';
        setBoard(next);
        setPlayer(player === 'X' ? 'X' : 'O');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBoard(initialBoard);
    setPlayer('X');
  };

  // Get game status message
  const getStatusMessage = () => {
    if (winner) {
      return `🎉 ${winner} Wins!`;
    }
    if (isDraw) {
      return "🤝 It's a Draw!";
    }
    if (loading) {
      return '🤔 Agent is thinking...';
    }
    return `Your turn: Play as ${player}`;
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', textAlign: 'center' }}>
      <h1>Game Playing Agent</h1>
      <div style={{ 
        padding: '12px 20px',
        margin: '20px auto',
        backgroundColor: gameOver ? '#4ade80' : '#3b82f6',
        color: 'white',
        borderRadius: 8,
        fontSize: 18,
        fontWeight: 600,
        transition: 'background-color 0.3s'
      }}>
        {getStatusMessage()}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)',
          gap: 10,
          justifyContent: 'center',
          margin: '20px auto'
        }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={gameOver || loading || !!cell}
            style={{ 
              height: 100, 
              fontSize: 32,
              fontWeight: 'bold',
              cursor: (gameOver || loading || cell) ? 'not-allowed' : 'pointer',
              opacity: (gameOver || loading || cell) && !cell ? 0.5 : 1,
              transition: 'all 0.2s',
              color: cell === 'X' ? '#3b82f6' : cell === 'O' ? '#ef4444' : 'inherit'
            }}
          >
            {cell || ''}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={requestAgentMove} disabled={loading || gameOver}>
          {loading ? 'Thinking…' : 'Ask Agent to Move'}
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      <p style={{ marginTop: 20, fontSize: 12, opacity: 0.7 }}>
        API Base: {apiBase}
      </p>
    </div>
  );
}

export default App;
