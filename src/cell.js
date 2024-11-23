import { Assets, Sprite } from 'pixi.js';

// enum object
export const CellType = Object.freeze({
    empty: 'empty'
});

export class Cell {
    constructor(cellType, gridPosition) {
        this.position = { x: gridPosition.x, y: gridPosition.y };
        this.type = cellType;
        this.sprite = Sprite.from(this.type);
        this.sprite.on('pointerdown', this.onClick.bind(this));
    }

    onClick(event) {
        const mousePos = event.data.global;
        console.log(`Cell clicked at (${this.position.x}, ${this.position.y})`);
        console.log(`Mouse clicked at (${mousePos.x}, ${mousePos.y})`);
    }
}