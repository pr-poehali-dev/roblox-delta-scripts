import { Progress } from '@/components/ui/progress';
import { Fighter } from './types';

interface HealthBarProps {
  fighter: Fighter;
}

const HealthBar = ({ fighter }: HealthBarProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg" style={{ color: fighter.color }}>{fighter.name}</span>
        <span className="text-sm text-gray-400">{fighter.health} HP</span>
      </div>
      <Progress value={(fighter.health / fighter.maxHealth) * 100} className="h-4" />
      {fighter.comboMove && (
        <div className={`mt-2 text-sm font-bold ${fighter.comboMove === 'fatality' ? 'text-purple-400 text-lg animate-pulse' : 'text-orange-400'}`}>
          {fighter.comboMove === 'fatality' ? '💀 FATALITY!' : fighter.comboMove === 'fire' ? '🔥 FIRE STRIKE!' : '💥 HEAVY PUNCH!'}
        </div>
      )}
    </div>
  );
};

export default HealthBar;
