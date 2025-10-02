import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Fighter } from './types';

interface ControlsTabProps {
  fighter1: Fighter;
  fighter2: Fighter;
}

const ControlsTab = ({ fighter1, fighter2 }: ControlsTabProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-card border border-border p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: fighter1.color }}>
          <Icon name="Gamepad2" size={20} />
          Player 1
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Движение:</span>
            <span className="font-mono bg-muted px-2 rounded">A / D</span>
          </div>
          <div className="flex justify-between">
            <span>Прыжок:</span>
            <span className="font-mono bg-muted px-2 rounded">W</span>
          </div>
          <div className="flex justify-between">
            <span>Атака:</span>
            <span className="font-mono bg-muted px-2 rounded">F</span>
          </div>
        </div>
      </Card>

      <Card className="bg-card border border-border p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: fighter2.color }}>
          <Icon name="Gamepad2" size={20} />
          Player 2
        </h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Движение:</span>
            <span className="font-mono bg-muted px-2 rounded">← / →</span>
          </div>
          <div className="flex justify-between">
            <span>Прыжок:</span>
            <span className="font-mono bg-muted px-2 rounded">↑</span>
          </div>
          <div className="flex justify-between">
            <span>Атака:</span>
            <span className="font-mono bg-muted px-2 rounded">SHIFT</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ControlsTab;
