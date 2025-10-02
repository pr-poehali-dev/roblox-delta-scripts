import { useEffect, useRef } from 'react';
import { Fighter, Particle, CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y } from './types';

interface GameCanvasProps {
  fighter1: Fighter;
  fighter2: Fighter;
  particles: Particle[];
  gameStarted: boolean;
  winner: string | null;
  onStartGame: () => void;
}

const GameCanvas = ({ fighter1, fighter2, particles, gameStarted, winner, onStartGame }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, GROUND_Y + 30, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y - 30);

    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    const drawFighter = (fighter: Fighter) => {
      ctx.save();
      
      ctx.fillStyle = fighter.color;
      ctx.fillRect(fighter.x, fighter.y, 50, 80);
      
      ctx.fillStyle = '#FFF';
      ctx.fillRect(fighter.x + 15, fighter.y + 20, 8, 8);
      ctx.fillRect(fighter.x + 27, fighter.y + 20, 8, 8);

      if (fighter.comboMove === 'fatality') {
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.random() * 0.3;
        ctx.fillStyle = '#8B00FF';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.restore();
        
        ctx.fillStyle = '#8B00FF';
        const punchX = fighter.direction === 'right' ? fighter.x + 50 : fighter.x - 60;
        ctx.fillRect(punchX, fighter.y + 15, 60, 40);
        
        for (let i = 0; i < 5; i++) {
          const gradient = ctx.createRadialGradient(punchX + 30, fighter.y + 35, 5, punchX + 30, fighter.y + 35, 20 + i * 10);
          gradient.addColorStop(0, '#8B00FF');
          gradient.addColorStop(0.5, '#FF00FF');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(punchX + 30, fighter.y + 35, 20 + i * 10, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Montserrat';
        ctx.strokeStyle = '#8B00FF';
        ctx.lineWidth = 4;
        ctx.strokeText('💀 FATALITY', CANVAS_WIDTH / 2 - 80, 50);
        ctx.fillText('💀 FATALITY', CANVAS_WIDTH / 2 - 80, 50);
      } else if (fighter.comboMove === 'fire') {
        ctx.fillStyle = '#FF6B00';
        const punchX = fighter.direction === 'right' ? fighter.x + 50 : fighter.x - 40;
        ctx.fillRect(punchX, fighter.y + 25, 40, 20);
        
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#FF6B00' : '#FFD700';
          ctx.beginPath();
          ctx.arc(punchX + 20 + i * 15, fighter.y + 35, 10, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = '#FF6B00';
        ctx.font = 'bold 16px Montserrat';
        ctx.fillText('🔥 FIRE!', fighter.x - 20, fighter.y - 10);
      } else if (fighter.comboMove === 'heavy') {
        ctx.fillStyle = '#FFD700';
        const punchX = fighter.direction === 'right' ? fighter.x + 50 : fighter.x - 50;
        ctx.fillRect(punchX, fighter.y + 20, 50, 30);
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(punchX + 25, fighter.y + 35, 15 + i * 8, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Montserrat';
        ctx.fillText('💥 HEAVY!', fighter.x - 20, fighter.y - 10);
      } else if (fighter.isAttacking) {
        ctx.fillStyle = fighter.color;
        const punchX = fighter.direction === 'right' ? fighter.x + 50 : fighter.x - 30;
        ctx.fillRect(punchX, fighter.y + 30, 30, 15);
        
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(punchX + 15, fighter.y + 37, 20, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    drawFighter(fighter1);
    drawFighter(fighter2);
  }, [fighter1, fighter2, particles]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full border-2 border-border rounded-lg"
      />
      
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
          <div className="text-center">
            {winner ? (
              <>
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-4xl font-black mb-4 gradient-purple-pink bg-clip-text text-transparent">
                  {winner} WINS!
                </h2>
              </>
            ) : (
              <div className="text-6xl mb-4">⚔️</div>
            )}
            <button 
              onClick={onStartGame} 
              className="gradient-purple-pink font-bold text-xl px-8 py-6 border-0 rounded-lg hover:opacity-90 transition-opacity"
            >
              {winner ? 'ИГРАТЬ СНОВА' : 'СТАРТ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
