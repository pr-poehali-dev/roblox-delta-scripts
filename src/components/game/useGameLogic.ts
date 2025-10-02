import { useState, useEffect, useRef } from 'react';
import { Fighter, Particle, GROUND_Y, GRAVITY, JUMP_FORCE, MOVE_SPEED, CANVAS_WIDTH, ATTACK_DAMAGE, FIRE_DAMAGE, HEAVY_DAMAGE, FATALITY_DAMAGE, ATTACK_RANGE, COMBO_TIMEOUT } from './types';

export const useGameLogic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
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

  const startGame = () => {
    setFighter1(prev => ({ ...prev, health: 100, keySequence: [], comboMove: null }));
    setFighter2(prev => ({ ...prev, health: 100, keySequence: [], comboMove: null }));
    setWinner(null);
    setGameStarted(true);
    setParticles([]);
  };

  return {
    fighter1,
    fighter2,
    particles,
    gameStarted,
    winner,
    fatalityActive,
    startGame
  };
};
