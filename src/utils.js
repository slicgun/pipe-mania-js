import { originalSize, cellSize } from './cell.js';
import { Text, TextStyle } from 'pixi.js';

export const ToRadians = Math.PI / 180; 

export function setupSprite(sprite, screenPosition, rotation = 0, scale = 1) {
    sprite.anchor.set(0.5);
    sprite.rotation = rotation * ToRadians;
    sprite.x = screenPosition.x;
    sprite.y = screenPosition.y;
    sprite.scale = scale * (cellSize / originalSize);
    sprite.interactive = true;
}

export function createText() {
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fill: '#ffffff',
        align: 'center',
        stroke: '#0000ff',
        strokeThickness: 4
    });

    const text = new Text("", style);
    text.anchor.set(0.5);
    return text;
}