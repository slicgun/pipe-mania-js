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
    #stageInterface;
    #getNextPipeCallback;
    #addToWaterManagerCallback;
    #firstClickCallback;
    #waterGraphics;
    #sprite;
    #full;
    #type;
    #position;
    #onClickCallback;

    constructor(cellType, gridPosition, stageInterface, callbacks) {
        this.#type = cellType;
        this.#position = { x: gridPosition.x, y: gridPosition.y };
        this.#full = false;
        // [up, down, left, right], 0 means no opening
        this.openings = [0, 0, 0, 0];

        this.#stageInterface = stageInterface;
        this.#getNextPipeCallback = callbacks.getNextPipe;
        this.#addToWaterManagerCallback = callbacks.addToWaterManager;
        this.#firstClickCallback = callbacks.firstPipePlaced;
        this.#onClickCallback = this.onClick.bind(this);

        this.#sprite = Sprite.from(this.#type);
        this.#sprite.on('pointerdown', this.#onClickCallback);
        this.#waterGraphics = new Graphics();
    }

    getPosition() {
        return this.#position;
    }

    getType() {
        return this.#type;
    }

    setFull() {
        this.#full = true;
    }

    isFull() {
        return this.#full;
    }

    getSprite() {
        return this.#sprite;
    }

    addWater() {
        this.#waterGraphics.clear();
        this.#waterGraphics.fill(0x0000FF);
        this.#waterGraphics.rect(0, 0, cellSize - 1, cellSize - 1);
        this.#waterGraphics.fill();
        this.#waterGraphics.pivot.set(cellSize * 0.5, cellSize * 0.5);
        this.#waterGraphics.position.set(this.#sprite.position.x, this.#sprite.position.y);
        this.#stageInterface.addToStage(this.#waterGraphics);
        this.#stageInterface.removeFromStage(this.#sprite);
        this.#stageInterface.addToStage(this.#sprite);
        this.#full = true;
    }

    setNewType(newType) {
        const sprite = this.#sprite;
        this.#type = newType;
        sprite.off('pointerdown', this.#onClickCallback);
        this.#stageInterface.removeFromStage(sprite);

        const screenPos = { x: sprite.position.x, y: sprite.position.y };

        this.#sprite = Sprite.from(this.#type);
        setupSprite(this.#sprite, screenPos);
        this.#sprite.on('pointerdown', this.#onClickCallback);
        this.#stageInterface.addToStage(this.#sprite);
    }

    /*
        I have chosen to not allow the user to replace existing pipes that are already full
        this is because I feel like there are various ambiguous scenarios/edge cases 
        For example: if we put a pipe down, splitting the stream, what happens to the water
        that is not connected to the main source (start block)?
        The specification also implies it is impossible to do this:
        "The player loses if the water flows out of the pipeline ( reaching the last segment) or
        reaches a dead-end without completing the minimum path length"
        If I reach a dead end, and I could fix it by replacing an existing full pipe, and avoid the lose condition
    */

    onClick() {
        if (this.#type === 'blocked' || this.#type === 'start' || this.#full) {
            return;
        }

        if (!Game.isPlaying) {
            Game.isPlaying = true;
            this.#firstClickCallback(this);
        }

        const pipe = this.#getNextPipeCallback();
        const screenPos = { x: this.#sprite.position.x, y: this.#sprite.position.y };

        this.#stageInterface.removeFromStage(this.#sprite);
        this.#sprite = Sprite.from(pipe.type);
        this.#type = pipe.type;
        this.openings = pipe.openings;
        setupSprite(this.#sprite, screenPos, pipe.rotation);
        this.#sprite.on('pointerdown', this.onClick.bind(this));
        this.#stageInterface.addToStage(this.#sprite);
        this.#addToWaterManagerCallback(this);
        
    }
}