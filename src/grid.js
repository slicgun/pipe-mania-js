import { Graphics, Sprite } from 'pixi.js';
import { Cell, CellType, originalSize, cellSize } from './cell.js';
import { setupSprite } from './utils.js';



export class Grid {
    constructor(stageInterface, xPos, yPos, cellClickCallback) {
        this.position = { x: xPos, y: yPos };
        this.size = { x: 9, y: 7 };
        this.cells = [];
        this.#setupGrid(stageInterface, cellClickCallback);

        let numBlocked = 3;

        for (let i = 0; i < numBlocked; i++) {
            const gridPos = {
                x: Math.floor(Math.random() * this.size.x),
                y: Math.floor(Math.random() * this.size.y)
            };
            this.#setCell(gridPos, CellType.blocked, stageInterface);
        }

        const startPos = {
            x: Math.floor(Math.random() * this.size.x),
            y: Math.floor(Math.random() * (this.size.y - 1))
        };

        this.#setCell(startPos, CellType.start, stageInterface);
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

    #setCell(gridPosition, newType, stageInterface) {
        const cell = this.cells[gridPosition.x + gridPosition.y * this.size.x];
        const sprite = cell.sprite;
        cell.type = newType;
        stageInterface.removeFromStage(sprite);

        const screenPos = { x: sprite.position.x, y: sprite.position.y };

        cell.sprite = Sprite.from(cell.type);
        setupSprite(cell.sprite, screenPos);
        stageInterface.addToStage(cell.sprite);
    }
}