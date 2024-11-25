import { Assets, Sprite } from 'pixi.js';
import { setupSprite } from './utils';

// enum object
export const CellType = Object.freeze({
    empty: 'empty',
    pipe: 'pipe',
    curved: 'curved',
    cross: 'cross',
    blocked: 'blocked',
    start: 'start'
});

export const originalSize = 16;
export const cellSize = 64;


export class Cell {
    constructor(cellType, gridPosition, stageInterface, cellClickCallback) {
        this.type = cellType;
        this.position = { x: gridPosition.x, y: gridPosition.y };
        this.stageInterface = stageInterface;
        this.onClickCallback = cellClickCallback;

        this.sprite = Sprite.from(this.type);
        this.sprite.on('pointerdown', this.onClick.bind(this));
    }

    onClick(event) {
        if (this.type === 'blocked') {
            return;
        }

        const mousePos = event.data.global;
        console.log(`Cell clicked at (${this.position.x}, ${this.position.y})`);
        console.log(`Mouse clicked at (${mousePos.x}, ${mousePos.y})`);
        const pipe = this.onClickCallback();
        const oldScreenPos = { x: this.sprite.position.x, y: this.sprite.position.y };
        this.stageInterface.removeFromStage(this.sprite);
        this.sprite = Sprite.from(pipe.type);
        this.type = pipe.type;
        setupSprite(this.sprite, oldScreenPos, pipe.rotation);
        this.sprite.on('pointerdown', this.onClick.bind(this));
        this.stageInterface.addToStage(this.sprite);
        //console.log(pipe);
    }
}