import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileControlsProps {
  playerId: 1 | 2;
  color: string;
}

const MobileControls = ({ playerId, color }: MobileControlsProps) => {
  const handleTouch = (key: string) => {
    const keyDownEvent = new KeyboardEvent('keydown', { key });
    const keyUpEvent = new KeyboardEvent('keyup', { key });
    
    window.dispatchEvent(keyDownEvent);
    setTimeout(() => window.dispatchEvent(keyUpEvent), 100);
  };

  const player1Keys = {
    left: 'a',
    right: 'd',
    jump: 'w',
    attack: 'f',
    special1: 's',
    special2: 'q'
  };

  const player2Keys = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    attack: 'Shift',
    special1: 'ArrowDown',
    special2: 'Enter'
  };

  const keys = playerId === 1 ? player1Keys : player2Keys;

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-card/50 rounded-lg border border-border">
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="lg"
          className="h-16 touch-none active:scale-95 transition-transform"
          style={{ borderColor: color }}
          onTouchStart={() => handleTouch(keys.left)}
        >
          <Icon name="ChevronLeft" size={32} />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-16 touch-none active:scale-95 transition-transform"
          style={{ borderColor: color }}
          onTouchStart={() => handleTouch(keys.right)}
        >
          <Icon name="ChevronRight" size={32} />
        </Button>
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="outline"
          size="lg"
          className="h-24 w-24 rounded-full touch-none active:scale-95 transition-transform"
          style={{ borderColor: color, borderWidth: '2px' }}
          onTouchStart={() => handleTouch(keys.jump)}
        >
          <Icon name="ChevronUp" size={40} />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="default"
          size="lg"
          className="h-16 touch-none active:scale-95 transition-transform font-bold"
          style={{ backgroundColor: color }}
          onTouchStart={() => handleTouch(keys.attack)}
        >
          👊 Удар
        </Button>
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-14 touch-none active:scale-95 transition-transform text-xs"
            style={{ borderColor: color }}
            onTouchStart={() => handleTouch(keys.special1)}
          >
            🔥
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-14 touch-none active:scale-95 transition-transform text-xs"
            style={{ borderColor: color }}
            onTouchStart={() => handleTouch(keys.special2)}
          >
            💀
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
