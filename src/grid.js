import { Graphics } from 'pixi.js';
import { Cell, CellType, originalSize, cellSize } from './cell.js';
import { setupSprite } from './utils.js';



export class Grid {
    constructor(stageInterface, xPos, yPos, cellClickCallback) {
        this.position = { x: xPos, y: yPos };
        this.size = { x: 9, y: 7 };
        this.cells = [];
        this.#setupGrid(stageInterface, cellClickCallback);
    }

    #setupGrid(stageInterface, cellClickCallback) {
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                let xOff = -cellSize * this.size.x * 0.5;
                let yOff = -cellSize * this.size.y * 0.5;
                let screenPosition = {
                    x: this.position.x + x * (cellSize + 1) + xOff,
                    y: this.position.y + y * (cellSize + 1) + yOff
                };
                this.#addCell(stageInterface, screenPosition, {x: x, y: y}, cellClickCallback);
            }
        }

    }

    #addCell(stageInterface, screenPosition, gridPosition, cellClickCallback) {
        const cell = new Cell(CellType.empty, gridPosition, stageInterface, cellClickCallback);
        const sprite = cell.sprite;
        setupSprite(sprite, screenPosition);

        stageInterface.addToStage(sprite);
        this.cells.push(cell);
    }
}