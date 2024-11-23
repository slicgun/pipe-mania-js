import { Graphics } from 'pixi.js';
import { Cell, CellType } from './cell.js';

const originalSize = 16;
const cellSize = 64;

export class Grid {
    constructor(game, xPos, yPos) {
        this.game = game;
        this.position = { x: xPos, y: yPos };
        this.size = { x: 9, y: 7 };
        this.cells = [];
        this.#setupGrid();
    }

    #setupGrid() {
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                let xOff = -cellSize * this.size.x * 0.5;
                let yOff = -cellSize * this.size.y * 0.5;
                let screenPosition = {
                    x: this.position.x + x * cellSize + x + xOff,
                    y: this.position.y + y * cellSize + y + yOff
                };
                this.#addCell(screenPosition, {x: x, y: y});
            }
        }

    }

    #addCell(screenPosition, gridPosition) {
        const cell = new Cell(CellType.empty, gridPosition);
        const sprite = cell.sprite;
        sprite.anchor.set(0.5);
        sprite.x = screenPosition.x;
        sprite.y = screenPosition.y;
        sprite.scale = cellSize / originalSize;

        sprite.interactive = true;
        this.game.addToStage(cell.sprite);
        this.cells.push(cell);
    }
}