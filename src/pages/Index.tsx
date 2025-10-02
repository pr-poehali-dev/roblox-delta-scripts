import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  comboMove: string | null;
  keySequence: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 5;
const ATTACK_DAMAGE = 10;
const FIRE_DAMAGE = 25;
const HEAVY_DAMAGE = 35;
const FATALITY_DAMAGE = 100;
const ATTACK_RANGE = 60;
const COMBO_TIMEOUT = 1200;

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showComboMenu, setShowComboMenu] = useState(true);
  const [fatalityActive, setFatalityActive] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());
  const [particles, setParticles] = useState<Particle[]>([]);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
    isJumping: false,
    comboMove: null,
    keySequence: []
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
    isJumping: false,
    comboMove: null,
    keySequence: []
  });

  const createParticles = (x: number, y: number, color: string, count: number = 20) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color,
        size: Math.random() * 8 + 4
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const checkCollision = (f1: Fighter, f2: Fighter): boolean => {
    const distance = Math.abs(f1.x - f2.x);
    return distance < ATTACK_RANGE && Math.abs(f1.y - f2.y) < 50;
  };

  const attack = (attacker: Fighter, defender: Fighter, setDefender: Function) => {
    if ((attacker.isAttacking || attacker.comboMove) && checkCollision(attacker, defender)) {
      let damage = ATTACK_DAMAGE;
      let particleColor = attacker.color;
      
      if (attacker.comboMove === 'fatality') {
        damage = FATALITY_DAMAGE;
        particleColor = '#8B00FF';
        setFatalityActive(true);
        createParticles(defender.x + 25, defender.y + 40, '#8B00FF', 50);
        createParticles(defender.x + 25, defender.y + 40, '#FF0000', 50);
        createParticles(defender.x + 25, defender.y + 40, '#FFD700', 50);
        setTimeout(() => setFatalityActive(false), 2000);
      } else if (attacker.comboMove === 'fire') {
        damage = FIRE_DAMAGE;
        particleColor = '#FF6B00';
        createParticles(defender.x + 25, defender.y + 40, particleColor, 30);
      } else if (attacker.comboMove === 'heavy') {
        damage = HEAVY_DAMAGE;
        particleColor = '#FFD700';
        createParticles(defender.x + 25, defender.y + 40, particleColor, 25);
      } else {
        createParticles(defender.x + 25, defender.y + 40, particleColor, 15);
      }
      
      const newHealth = Math.max(0, defender.health - damage);
      setDefender((prev: Fighter) => ({ ...prev, health: newHealth }));
      
      if (newHealth === 0) {
        setWinner(attacker.name);
        setGameStarted(false);
      }
    }
  };

  const checkCombo = (sequence: string[], player: 1 | 2): string | null => {
    const seqStr = sequence.join('');
    const player1Keys = { move: 'a', attack1: 'f', attack2: 's', special: 'q' };
    const player2Keys = { move: 'arrowleft', attack1: 'shift', attack2: 'arrowdown', special: 'enter' };
    
    const keys = player === 1 ? player1Keys : player2Keys;
    
    if (seqStr === keys.move + keys.attack1 + keys.attack1 + keys.special) return 'fatality';
    if (seqStr === keys.move + keys.attack1) return 'fire';
    if (seqStr === keys.attack1 + keys.attack1) return 'heavy';
    
    return null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);
      
      if (['a', 'f', 's', 'q'].includes(key)) {
        setFighter1(prev => {
          const newSeq = [...prev.keySequence, key].slice(-4);
          const combo = checkCombo(newSeq, 1);
          
          if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
          comboTimerRef.current = setTimeout(() => {
            setFighter1(p => ({ ...p, keySequence: [] }));
          }, COMBO_TIMEOUT);
          
          return { ...prev, keySequence: newSeq, comboMove: combo };
        });
      }
      
      if (['arrowleft', 'shift', 'arrowdown', 'enter'].includes(key)) {
        setFighter2(prev => {
          const newSeq = [...prev.keySequence, key].slice(-4);
          const combo = checkCombo(newSeq, 2);
          
          if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
          comboTimerRef.current = setTimeout(() => {
            setFighter2(p => ({ ...p, keySequence: [] }));
          }, COMBO_TIMEOUT);
          
          return { ...prev, keySequence: newSeq, comboMove: combo };
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
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
        const newComboMove = prev.comboMove;

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
        if (keysPressed.current.has('f')) {
          if (newComboMove) {
            setTimeout(() => {
              setFighter1(f => ({ ...f, comboMove: null, isAttacking: false }));
            }, 400);
          } else {
            newIsAttacking = true;
            setTimeout(() => {
              setFighter1(f => ({ ...f, isAttacking: false }));
            }, 200);
          }
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
          isAttacking: newIsAttacking,
          comboMove: newComboMove
        };
      });

      setFighter2(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelocityY = prev.velocityY;
        let newIsJumping = prev.isJumping;
        let newDirection = prev.direction;
        let newIsAttacking = false;
        const newComboMove = prev.comboMove;

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
        if (keysPressed.current.has('shift')) {
          if (newComboMove) {
            setTimeout(() => {
              setFighter2(f => ({ ...f, comboMove: null, isAttacking: false }));
            }, 400);
          } else {
            newIsAttacking = true;
            setTimeout(() => {
              setFighter2(f => ({ ...f, isAttacking: false }));
            }, 200);
          }
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
          isAttacking: newIsAttacking,
          comboMove: newComboMove
        };
      });

      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3,
          life: p.life - 0.02
        })).filter(p => p.life > 0)
      );
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted]);

  useEffect(() => {
    if (fighter1.isAttacking || fighter1.comboMove) {
      attack(fighter1, fighter2, setFighter2);
    }
  }, [fighter1.isAttacking, fighter1.comboMove]);

  useEffect(() => {
    if (fighter2.isAttacking || fighter2.comboMove) {
      attack(fighter2, fighter1, setFighter1);
    }
  }, [fighter2.isAttacking, fighter2.comboMove]);

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

  const startGame = () => {
    setFighter1(prev => ({ ...prev, health: 100, keySequence: [], comboMove: null }));
    setFighter2(prev => ({ ...prev, health: 100, keySequence: [], comboMove: null }));
    setWinner(null);
    setGameStarted(true);
    setParticles([]);
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
              {fighter1.comboMove && (
                <div className={`mt-2 text-sm font-bold ${fighter1.comboMove === 'fatality' ? 'text-purple-400 text-lg animate-pulse' : 'text-orange-400'}`}>
                  {fighter1.comboMove === 'fatality' ? '💀 FATALITY!' : fighter1.comboMove === 'fire' ? '🔥 FIRE STRIKE!' : '💥 HEAVY PUNCH!'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg" style={{ color: fighter2.color }}>{fighter2.name}</span>
                <span className="text-sm text-gray-400">{fighter2.health} HP</span>
              </div>
              <Progress value={(fighter2.health / fighter2.maxHealth) * 100} className="h-4" />
              {fighter2.comboMove && (
                <div className={`mt-2 text-sm font-bold ${fighter2.comboMove === 'fatality' ? 'text-purple-400 text-lg animate-pulse' : 'text-orange-400'}`}>
                  {fighter2.comboMove === 'fatality' ? '💀 FATALITY!' : fighter2.comboMove === 'fire' ? '🔥 FIRE STRIKE!' : '💥 HEAVY PUNCH!'}
                </div>
              )}
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

        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="controls">Управление</TabsTrigger>
            <TabsTrigger value="combos">Комбо Удары</TabsTrigger>
          </TabsList>
          
          <TabsContent value="controls" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="combos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card border-2 border-orange-500 p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-400 text-lg">
                  <Icon name="Flame" size={24} />
                  Player 1 Комбо
                </h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg border border-orange-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-orange-400">🔥 Огненный Удар</span>
                      <span className="text-xs text-gray-400">25 урона</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">A</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-yellow-400">💥 Жёсткий Удар</span>
                      <span className="text-xs text-gray-400">35 урона</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg border-2 border-purple-500 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-400">💀 ФАТАЛИТИ</span>
                      <span className="text-xs text-red-400 font-bold">100 урона!</span>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">A</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">Q</kbd>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-2 border-red-500 p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-red-400 text-lg">
                  <Icon name="Flame" size={24} />
                  Player 2 Комбо
                </h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg border border-orange-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-orange-400">🔥 Огненный Удар</span>
                      <span className="text-xs text-gray-400">25 урона</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">←</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">SHIFT</kbd>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-yellow-400">💥 Жёсткий Удар</span>
                      <span className="text-xs text-gray-400">35 урона</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">SHIFT</kbd>
                      <span className="text-gray-400">+</span>
                      <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">SHIFT</kbd>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg border-2 border-purple-500 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-400">💀 ФАТАЛИТИ</span>
                      <span className="text-xs text-red-400 font-bold">100 урона!</span>
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">←</kbd>
                      <span className="text-gray-400 text-xs">+</span>
                      <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">SHIFT</kbd>
                      <span className="text-gray-400 text-xs">+</span>
                      <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">SHIFT</kbd>
                      <span className="text-gray-400 text-xs">+</span>
                      <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">ENTER</kbd>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-muted/50 border border-primary/30 p-4">
              <div className="flex gap-3">
                <Icon name="Info" className="text-primary flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-gray-300">
                  <p className="font-bold mb-1">Как использовать комбо:</p>
                  <p>Быстро нажимайте клавиши одну за другой. Между нажатиями должно пройти менее 1.2 секунды. Комбо активируется автоматически при правильной последовательности!</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-purple-950/30 border-2 border-purple-500 p-4">
              <div className="flex gap-3">
                <Icon name="Skull" className="text-purple-400 flex-shrink-0 mt-0.5" size={24} />
                <div className="text-sm text-gray-300">
                  <p className="font-bold mb-1 text-purple-400 text-lg">⚠️ ФАТАЛИТИ - Финишный Удар!</p>
                  <p>Мгновенно наносит 100 урона - гарантированная победа! Используйте, когда противник близко. Это самая мощная атака в игре с невероятными визуальными эффектами!</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;