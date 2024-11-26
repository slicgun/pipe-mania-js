import { originalSize, cellSize } from './cell.js';

export const ToRadians = Math.PI / 180; 

export function setupSprite(sprite, screenPosition, rotation = 0, scale = 1) {
    sprite.anchor.set(0.5);
    sprite.rotation = rotation * ToRadians;
    sprite.x = screenPosition.x;
    sprite.y = screenPosition.y;
    sprite.scale = scale * (cellSize / originalSize);
    sprite.interactive = true;
}