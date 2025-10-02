export interface Fighter {
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

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;
export const GROUND_Y = 320;
export const GRAVITY = 0.8;
export const JUMP_FORCE = -15;
export const MOVE_SPEED = 5;
export const ATTACK_DAMAGE = 10;
export const FIRE_DAMAGE = 25;
export const HEAVY_DAMAGE = 35;
export const FATALITY_DAMAGE = 100;
export const ATTACK_RANGE = 60;
export const COMBO_TIMEOUT = 1200;
