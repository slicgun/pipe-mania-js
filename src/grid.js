import { Cell, CellType, cellSize } from './cell.js';
import { setupSprite } from './utils.js';

export class Grid {
    #position;
    #size;
    #cells;
    #startPos;

    constructor(stageInterface, xPos, yPos, callbacks) {
        this.#position = { x: xPos, y: yPos };
        this.#size = { x: 9, y: 7 };
        this.#cells = [];
        this.#setupGrid(stageInterface, callbacks);

        this.#startPos = {
            x: Math.floor(Math.random() * this.#size.x),
            y: Math.floor(Math.random() * (this.#size.y - 1))
        };
        
        this.#setCell(this.#startPos, CellType.start, stageInterface);
        const cell = this.getCell(this.#startPos);
        cell.openings = [0, 1, 0, 0];

        let numBlocked = 3;
        for (let i = 0; i < numBlocked; i++) {
            let gridPos = {
                x: Math.floor(Math.random() * this.#size.x),
                y: Math.floor(Math.random() * this.#size.y)
            };
            if (gridPos.x === this.#startPos.x) {
                let badPosition = gridPos.y === this.#startPos.y || gridPos.y === (this.#startPos.y + 1)
                while (badPosition) {
                    gridPos.y = Math.floor(Math.random() * this.#size.y);
                    badPosition = gridPos.y === this.#startPos.y || gridPos.y === (this.#startPos.y + 1)
                }
            }
            this.#setCell(gridPos, CellType.blocked, stageInterface);
        }
    }

    getStartPosition() {
        return this.#startPos;
    }

    getCell(gridPosition) {
        if (gridPosition.x >= this.#size.x || gridPosition.y >= this.#size.y) {
            console.log("out of bounds");
            return undefined;
        }
        return this.#cells[gridPosition.x + gridPosition.y * this.#size.x];
    }

    #setupGrid(stageInterface, callbacks) {
        for (let y = 0; y < this.#size.y; y++) {
            for (let x = 0; x < this.#size.x; x++) {
                let xOff = -cellSize * this.#size.x * 0.5;
                let yOff = -cellSize * this.#size.y * 0.5;
                let screenPosition = {
                    x: this.#position.x + x * (cellSize + 1) + xOff,
                    y: this.#position.y + y * (cellSize + 1) + yOff
                };
                this.#addCell(stageInterface, screenPosition, {x: x, y: y}, callbacks);
            }
        }

    }

    #addCell(stageInterface, screenPosition, gridPosition, callbacks) {
        const cell = new Cell(CellType.empty, gridPosition, stageInterface, callbacks);
        const sprite = cell.getSprite();
        setupSprite(sprite, screenPosition);

        stageInterface.addToStage(sprite);
        this.#cells.push(cell);
    }

    #setCell(gridPosition, newType) {
        const cell = this.getCell(gridPosition);
        cell.setNewType(newType);
    }
}