import { Graphics, Sprite } from 'pixi.js';
import { setupSprite } from './utils';
import { Game} from './game.js'

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
    constructor(cellType, gridPosition, stageInterface, callbacks) {
        this.type = cellType;
        this.position = { x: gridPosition.x, y: gridPosition.y };
        this.full = false;
        this.openings = [0, 0, 0, 0];

        this.stageInterface = stageInterface;
        this.getNextPipeCallback = callbacks.getNextPipe;
        this.addToWaterManagerCallback = callbacks.addToWaterManager;
        this.firstClickCallback = callbacks.firstPipePlaced;

        this.sprite = Sprite.from(this.type);
        this.sprite.on('pointerdown', this.onClick.bind(this));
        this.waterGraphics = new Graphics();
    }

    addWater() {
        //keep this logic here cos for the animations (potentially)
        this.waterGraphics.fill(0x0000FF);
        this.waterGraphics.rect(0, 0, cellSize, cellSize);
        this.waterGraphics.fill();
        //this.waterGraphics.alpha = 0;
        this.waterGraphics.pivot.set((cellSize - 1) * 0.5, (cellSize - 1) * 0.5);
        this.waterGraphics.position.set(this.sprite.position.x, this.sprite.position.y);
        this.stageInterface.addToStage(this.waterGraphics);
        this.stageInterface.removeFromStage(this.sprite);
        this.stageInterface.addToStage(this.sprite);
        this.full = true;
    }

    setNewType(newType) {
        const sprite = this.sprite;
        this.type = newType;
        this.stageInterface.removeFromStage(sprite);

        const screenPos = { x: sprite.position.x, y: sprite.position.y };

        this.sprite = Sprite.from(this.type);
        setupSprite(this.sprite, screenPos);
        this.sprite.on('pointerdown', this.onClick.bind(this));
        this.stageInterface.addToStage(this.sprite);
    }

    onClick(event) {
        if (this.type === 'blocked' || this.type === 'start') {
            return;
        }

        if (!Game.isPlaying) {
            Game.isPlaying = true;
            this.firstClickCallback(this);
        }

        const mousePos = event.data.global;
        //console.log(`Cell clicked at (${this.position.x}, ${this.position.y})`);
        //console.log(`Mouse clicked at (${mousePos.x}, ${mousePos.y})`);
        const pipe = this.getNextPipeCallback();
        const oldScreenPos = { x: this.sprite.position.x, y: this.sprite.position.y };
        this.stageInterface.removeFromStage(this.sprite);
        this.sprite = Sprite.from(pipe.type);
        this.type = pipe.type;
        this.openings = pipe.openings;
        setupSprite(this.sprite, oldScreenPos, pipe.rotation);
        this.sprite.on('pointerdown', this.onClick.bind(this));
        this.stageInterface.addToStage(this.sprite);
        this.addToWaterManagerCallback(this);
        //console.log(pipe);
    }
}