import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Trophy, Maximize2, Minimize2 } from 'lucide-react';
import ScoreBoard from './components/ScoreBoard';
import KeyboardControls from './components/KeyboardControls';
import MobileControls from './components/MobileControls';
import EditableText from './components/EditableText';
import { Player, Ball, BALLS, GameState } from './types';
import { formatTime } from './utils/time';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('snookerGameState');
    return saved ? JSON.parse(saved) : {
      scores: { A: 0, B: 0 },
      frames: { A: 0, B: 0 },
      currentPlayer: 'A' as Player,
      break_: 0,
      remainingReds: 15,
      history: [],
      time: 0,
      isClockRunning: false,
      tableName: 'TABLE 1',
      playerNames: { A: 'PLAYER A', B: 'PLAYER B' }
    };
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const { scores, frames, currentPlayer, break_, remainingReds, history, time, isClockRunning, tableName, playerNames } = gameState;

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    localStorage.setItem('snookerGameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    let intervalId: number;

    if (isClockRunning) {
      intervalId = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          time: prev.time + 1
        }));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isClockRunning]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleBallPotted = (points: number) => {
    const pottedBall = BALLS.find(ball => ball.points === points);
    if (pottedBall) {
      updateGameState({
        history: [...history, pottedBall],
        scores: {
          ...scores,
          [currentPlayer]: scores[currentPlayer] + points
        },
        break_: break_ + points
      });
    }
  };

  const switchPlayer = () => {
    updateGameState({
      currentPlayer: currentPlayer === 'A' ? 'B' : 'A',
      break_: 0,
      history: []
    });
  };

  const endFrame = () => {
    const winner = scores.A > scores.B ? 'A' : 'B';
    updateGameState({
      frames: {
        ...frames,
        [winner]: frames[winner] + 1
      },
      scores: { A: 0, B: 0 },
      break_: 0,
      remainingReds: 15,
      history: []
    });
  };

  const resetGame = () => {
    localStorage.removeItem('snookerGameState');
    setGameState({
      scores: { A: 0, B: 0 },
      frames: { A: 0, B: 0 },
      currentPlayer: 'A',
      break_: 0,
      remainingReds: 15,
      history: [],
      time: 0,
      isClockRunning: false,
      tableName: 'TABLE 1',
      playerNames: { A: 'PLAYER A', B: 'PLAYER B' }
    });
  };

  const toggleClock = () => {
    updateGameState({ isClockRunning: !isClockRunning });
  };

  const resetClock = () => {
    updateGameState({ time: 0, isClockRunning: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            <header className="flex justify-between items-center bg-black/30 p-4 lg:p-6 rounded-2xl">
              <div className="flex items-center gap-2 md:gap-3">
                <Trophy className="w-6 h-6 md:w-12 md:h-12 text-amber-500" />
                <EditableText
                  value={tableName}
                  onChange={(name) => updateGameState({ tableName: name })}
                  className="text-xl md:text-5xl font-bold"
                />
              </div>
              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Timer className={`w-6 h-6 md:w-10 md:h-10 ${isClockRunning ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-xl md:text-4xl font-mono">{formatTime(time)}</span>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 md:p-3 hover:bg-white/10 rounded-xl transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-6 h-6 md:w-10 md:h-10 text-gray-400" />
                  ) : (
                    <Maximize2 className="w-6 h-6 md:w-10 md:h-10 text-gray-400" />
                  )}
                </button>
              </div>
            </header>

            <ScoreBoard
              scores={scores}
              frames={frames}
              currentPlayer={currentPlayer}
              break_={break_}
              remainingReds={remainingReds}
              tableName={tableName}
              playerNames={playerNames}
              onTableNameChange={(name) => updateGameState({ tableName: name })}
              onPlayerNameChange={(player, name) => updateGameState({
                playerNames: { ...playerNames, [player]: name }
              })}
            />

            <div className="hidden md:block">
              <KeyboardControls
                onBallPotted={handleBallPotted}
                onSwitchPlayer={switchPlayer}
                onEndFrame={endFrame}
                remainingReds={remainingReds}
                setRemainingReds={(reds) => updateGameState({ remainingReds: reds })}
                history={history}
                onToggleClock={toggleClock}
                onResetClock={resetClock}
                isClockRunning={isClockRunning}
                onReset={resetGame}
              />
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <MobileControls
            onBallPotted={handleBallPotted}
            onSwitchPlayer={switchPlayer}
            onEndFrame={endFrame}
            remainingReds={remainingReds}
            setRemainingReds={(reds) => updateGameState({ remainingReds: reds })}
            onToggleClock={toggleClock}
            onResetClock={resetClock}
            isClockRunning={isClockRunning}
            onReset={resetGame}
          />
        </div>
      </div>
    </div>
  );
}

export default App;