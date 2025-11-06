import { useMemo, useState } from 'react';
import './App.css';

const initialBoard = Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [player, setPlayer] = useState('X');
  const [loading, setLoading] = useState(false);
  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE || 'http://localhost:5000', []);

  const handleCellClick = (idx) => {
    if (board[idx] || loading) return;
    const next = [...board];
    next[idx] = player;
    setBoard(next);
  };

  const requestAgentMove = async () => {
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

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', textAlign: 'center' }}>
      <h1>Game Playing Agent</h1>
      <p>Simple Tic-Tac-Toe demo: you play as {player}. Then ask the agent to move.</p>
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
            style={{ height: 100, fontSize: 32 }}
          >
            {cell || ''}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={requestAgentMove} disabled={loading}>
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
