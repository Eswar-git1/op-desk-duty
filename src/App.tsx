import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Home from './pages/Home';
import Game from './pages/Game';
import Auth from './pages/Auth';
import Leaderboard from './pages/Leaderboard';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import { useGameStore } from './lib/store';
import { Howl } from 'howler';

// Background music setup
const bgMusic = new Howl({
  src: ['https://assets.mixkit.co/music/preview/mixkit-game-music-loop-006.mp3'],
  loop: true,
  volume: 0.3,
});

function App() {
  const { resetGame } = useGameStore();

  useEffect(() => {
    resetGame();
    bgMusic.play();
    return () => {
      bgMusic.stop();
    };
  }, [resetGame]);

  return (
    <Router>
      <Routes>
        {/* Redirect root to Auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/game"
          element={
            <PrivateRoute>
              <Game />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <Leaderboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;