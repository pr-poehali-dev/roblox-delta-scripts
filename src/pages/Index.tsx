import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Fighter {
  id: number;
  name: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  color: string;
  direction: 'left' | 'right';
  isAttacking: boolean;
  velocityY: number;
  isJumping: boolean;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 5;
const ATTACK_DAMAGE = 10;
const ATTACK_RANGE = 60;

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  
  const [fighter1, setFighter1] = useState<Fighter>({
    id: 1,
    name: 'Player 1',
    x: 150,
    y: GROUND_Y,
    health: 100,
    maxHealth: 100,
    color: '#3B82F6',
    direction: 'right',
    isAttacking: false,
    velocityY: 0,
    isJumping: false
  });

  const [fighter2, setFighter2] = useState<Fighter>({
    id: 2,
    name: 'Player 2',
    x: 600,
    y: GROUND_Y,
    health: 100,
    maxHealth: 100,
    color: '#EF4444',
    direction: 'left',
    isAttacking: false,
    velocityY: 0,
    isJumping: false
  });

  const checkCollision = (f1: Fighter, f2: Fighter): boolean => {
    const distance = Math.abs(f1.x - f2.x);
    return distance < ATTACK_RANGE && Math.abs(f1.y - f2.y) < 50;
  };

  const attack = (attacker: Fighter, defender: Fighter, setDefender: Function) => {
    if (attacker.isAttacking && checkCollision(attacker, defender)) {
      const newHealth = Math.max(0, defender.health - ATTACK_DAMAGE);
      setDefender((prev: Fighter) => ({ ...prev, health: newHealth }));
      
      if (newHealth === 0) {
        setWinner(attacker.name);
        setGameStarted(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      setFighter1(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelocityY = prev.velocityY;
        let newIsJumping = prev.isJumping;
        let newDirection = prev.direction;
        let newIsAttacking = false;

        if (keysPressed.current.has('a') && newX > 50) {
          newX -= MOVE_SPEED;
          newDirection = 'left';
        }
        if (keysPressed.current.has('d') && newX < CANVAS_WIDTH - 100) {
          newX += MOVE_SPEED;
          newDirection = 'right';
        }
        if (keysPressed.current.has('w') && !newIsJumping) {
          newVelocityY = JUMP_FORCE;
          newIsJumping = true;
        }
        if (keysPressed.current.has(' ')) {
          newIsAttacking = true;
          setTimeout(() => {
            setFighter1(f => ({ ...f, isAttacking: false }));
          }, 200);
        }

        newVelocityY += GRAVITY;
        newY += newVelocityY;

        if (newY >= GROUND_Y) {
          newY = GROUND_Y;
          newVelocityY = 0;
          newIsJumping = false;
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          velocityY: newVelocityY,
          isJumping: newIsJumping,
          direction: newDirection,
          isAttacking: newIsAttacking
        };
      });

      setFighter2(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelocityY = prev.velocityY;
        let newIsJumping = prev.isJumping;
        let newDirection = prev.direction;
        let newIsAttacking = false;

        if (keysPressed.current.has('arrowleft') && newX > 50) {
          newX -= MOVE_SPEED;
          newDirection = 'left';
        }
        if (keysPressed.current.has('arrowright') && newX < CANVAS_WIDTH - 100) {
          newX += MOVE_SPEED;
          newDirection = 'right';
        }
        if (keysPressed.current.has('arrowup') && !newIsJumping) {
          newVelocityY = JUMP_FORCE;
          newIsJumping = true;
        }
        if (keysPressed.current.has('enter')) {
          newIsAttacking = true;
          setTimeout(() => {
            setFighter2(f => ({ ...f, isAttacking: false }));
          }, 200);
        }

        newVelocityY += GRAVITY;
        newY += newVelocityY;

        if (newY >= GROUND_Y) {
          newY = GROUND_Y;
          newVelocityY = 0;
          newIsJumping = false;
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          velocityY: newVelocityY,
          isJumping: newIsJumping,
          direction: newDirection,
          isAttacking: newIsAttacking
        };
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted]);

  useEffect(() => {
    if (fighter1.isAttacking) {
      attack(fighter1, fighter2, setFighter2);
    }
  }, [fighter1.isAttacking]);

  useEffect(() => {
    if (fighter2.isAttacking) {
      attack(fighter2, fighter1, setFighter1);
    }
  }, [fighter2.isAttacking]);

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

    const drawFighter = (fighter: Fighter) => {
      ctx.save();
      
      ctx.fillStyle = fighter.color;
      ctx.fillRect(fighter.x, fighter.y, 50, 80);
      
      ctx.fillStyle = '#FFF';
      ctx.fillRect(fighter.x + 15, fighter.y + 20, 8, 8);
      ctx.fillRect(fighter.x + 27, fighter.y + 20, 8, 8);

      if (fighter.isAttacking) {
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
  }, [fighter1, fighter2]);

  const startGame = () => {
    setFighter1(prev => ({ ...prev, health: 100 }));
    setFighter2(prev => ({ ...prev, health: 100 }));
    setWinner(null);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F2937] via-[#1a1f2e] to-[#111827] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-6xl font-black text-center mb-8 gradient-purple-pink bg-clip-text text-transparent">
          PORTAL COMBAT
        </h1>

        <Card className="bg-card border-2 border-primary p-6 mb-4">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg" style={{ color: fighter1.color }}>{fighter1.name}</span>
                <span className="text-sm text-gray-400">{fighter1.health} HP</span>
              </div>
              <Progress value={(fighter1.health / fighter1.maxHealth) * 100} className="h-4" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg" style={{ color: fighter2.color }}>{fighter2.name}</span>
                <span className="text-sm text-gray-400">{fighter2.health} HP</span>
              </div>
              <Progress value={(fighter2.health / fighter2.maxHealth) * 100} className="h-4" />
            </div>
          </div>

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
                      <Icon name="Trophy" className="mx-auto mb-4 text-yellow-400" size={64} />
                      <h2 className="text-4xl font-black mb-4 gradient-purple-pink bg-clip-text text-transparent">
                        {winner} WINS!
                      </h2>
                    </>
                  ) : (
                    <Icon name="Swords" className="mx-auto mb-4 text-primary" size={64} />
                  )}
                  <Button 
                    onClick={startGame} 
                    size="lg"
                    className="gradient-purple-pink font-bold text-xl px-8 py-6 border-0"
                  >
                    {winner ? 'ИГРАТЬ СНОВА' : 'СТАРТ'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border border-border p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: fighter1.color }}>
              <Icon name="Gamepad2" size={20} />
              Player 1 Управление
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
                <span className="font-mono bg-muted px-2 rounded">SPACE</span>
              </div>
            </div>
          </Card>

          <Card className="bg-card border border-border p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: fighter2.color }}>
              <Icon name="Gamepad2" size={20} />
              Player 2 Управление
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
                <span className="font-mono bg-muted px-2 rounded">ENTER</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
