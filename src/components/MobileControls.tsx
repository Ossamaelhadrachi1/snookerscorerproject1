import React from 'react';
import { UserMinus, Flag, Timer, RotateCcw, Play, Pause, RefreshCw } from 'lucide-react';
import { BALLS } from '../types';

interface MobileControlsProps {
  onBallPotted: (points: number) => void;
  onSwitchPlayer: () => void;
  onEndFrame: () => void;
  remainingReds: number;
  setRemainingReds: (reds: number) => void;
  onToggleClock: () => void;
  onResetClock: () => void;
  isClockRunning: boolean;
  onReset: () => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({
  onBallPotted,
  onSwitchPlayer,
  onEndFrame,
  remainingReds,
  setRemainingReds,
  onToggleClock,
  onResetClock,
  isClockRunning,
  onReset,
}) => {
  const handleBallClick = (points: number, isRed: boolean) => {
    if (isRed && remainingReds > 0) {
      setRemainingReds(remainingReds - 1);
      onBallPotted(points);
    } else if (!isRed) {
      onBallPotted(points);
    }
  };

  return (
    <div className="bg-gray-900/95 border-t border-gray-800">
      <div className="max-h-[40vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Game Controls */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={onSwitchPlayer}
              className="flex-1 bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-center gap-3
                active:scale-95 transition-transform"
            >
              <UserMinus className="w-6 h-6" />
              <span className="text-base font-medium">Switch</span>
            </button>
            <button
              onClick={onEndFrame}
              className="flex-1 bg-red-600 text-white p-4 rounded-2xl flex items-center justify-center gap-3
                active:scale-95 transition-transform"
            >
              <Flag className="w-6 h-6" />
              <span className="text-base font-medium">End Frame</span>
            </button>
          </div>

          {/* Timer Controls */}
          <div className="flex gap-4">
            <button
              onClick={onToggleClock}
              className="flex-1 bg-green-600 text-white p-4 rounded-2xl flex items-center justify-center gap-3
                active:scale-95 transition-transform"
            >
              {isClockRunning ? (
                <>
                  <Pause className="w-6 h-6" />
                  <span className="text-base font-medium">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span className="text-base font-medium">Start</span>
                </>
              )}
            </button>
            <button
              onClick={onResetClock}
              className="flex-1 bg-yellow-600 text-white p-4 rounded-2xl flex items-center justify-center gap-3
                active:scale-95 transition-transform"
            >
              <Timer className="w-6 h-6" />
              <span className="text-base font-medium">Reset Clock</span>
            </button>
            <button
              onClick={onReset}
              className="flex-1 bg-purple-600 text-white p-4 rounded-2xl flex items-center justify-center gap-3
                active:scale-95 transition-transform"
            >
              <RefreshCw className="w-6 h-6" />
              <span className="text-base font-medium">Reset</span>
            </button>
          </div>

          {/* Ball Controls */}
          <div className="grid grid-cols-4 gap-4">
            {BALLS.map((ball) => (
              <button
                key={ball.color}
                onClick={() => handleBallClick(ball.points, ball.color === 'Red')}
                disabled={ball.color === 'Red' && remainingReds === 0}
                className={`
                  ${ball.bgColor} ${ball.textColor}
                  p-6 rounded-2xl
                  flex items-center justify-center
                  text-2xl font-bold
                  disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-95 transition-transform
                  shadow-lg
                `}
              >
                {ball.points}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;