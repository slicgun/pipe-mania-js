import { originalSize, cellSize } from './cell.js';

export function setupSprite(sprite, screenPosition) {
    sprite.anchor.set(0.5);
    sprite.x = screenPosition.x;
    sprite.y = screenPosition.y;
    sprite.scale = cellSize / originalSize;
    sprite.interactive = true;
}