import React from 'react';
import { Player } from '../types';
import EditableText from './EditableText';

interface ScoreBoardProps {
  scores: { [key in Player]: number };
  frames: { [key in Player]: number };
  currentPlayer: Player;
  break_: number;
  remainingReds: number;
  tableName: string;
  playerNames: { [key in Player]: string };
  onTableNameChange: (name: string) => void;
  onPlayerNameChange: (player: Player, name: string) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores = { A: 0, B: 0 },
  frames = { A: 0, B: 0 },
  currentPlayer = 'A',
  break_ = 0,
  remainingReds = 15,
  playerNames = { A: 'PLAYER A', B: 'PLAYER B' },
  onPlayerNameChange,
}) => {
  const pointsRemaining = Math.max(0, remainingReds * 8 + 27);

  return (
    <div className="bg-black/30 rounded-2xl p-6 md:p-10 space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <div className={`text-2xl md:text-6xl font-bold ${currentPlayer === 'A' ? 'text-amber-500' : ''}`}>
          <EditableText
            value={playerNames?.A || 'PLAYER A'}
            onChange={(name) => onPlayerNameChange('A', name)}
            className="text-2xl md:text-6xl font-bold"
          />
        </div>
        <div className="text-lg md:text-4xl text-amber-500">
          ({frames?.A || 0}-{frames?.B || 0})
        </div>
        <div className={`text-2xl md:text-6xl font-bold ${currentPlayer === 'B' ? 'text-amber-500' : ''}`}>
          <EditableText
            value={playerNames?.B || 'PLAYER B'}
            onChange={(name) => onPlayerNameChange('B', name)}
            className="text-2xl md:text-6xl font-bold"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className={`text-5xl md:text-9xl font-bold font-mono ${currentPlayer === 'A' ? 'text-amber-500' : ''}`}>
          {scores?.A || 0}
        </div>
        <div className="text-center">
          <div className="text-base md:text-2xl text-gray-400">REMAINING</div>
          <div className="text-xl md:text-4xl text-amber-500">{pointsRemaining}</div>
        </div>
        <div className={`text-5xl md:text-9xl font-bold font-mono ${currentPlayer === 'B' ? 'text-amber-500' : ''}`}>
          {scores?.B || 0}
        </div>
      </div>

      {break_ > 0 && (
        <div className="text-center">
          <span className="text-xl md:text-4xl text-red-500 font-bold">
            BREAK: {break_}
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;