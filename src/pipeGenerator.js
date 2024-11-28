import { Sprite } from "pixi.js";
import { cellSize, CellType } from "./cell";
import { setupSprite } from "./utils";

const screenWidthRatio = 0.05;
const screenHeightRatio = 0.6;
const displayOffset = 16;

export class PipeGenerator {
    #pipeChoices;
    #nextPipes;
    #displaySprites;
    #pipesToShow;
    #displayScale;
    #stageInterface;

    constructor(screenWidth, screenHeight, stageInterface) {
        this.#displayScale = 2;
        this.#pipesToShow = 4;
        this.#pipeChoices = ['pipe', 'curved', 'cross'];
        this.#stageInterface = stageInterface;

        this.#init(screenWidth, screenHeight);
    }

    #init(screenWidth, screenHeight) {
        this.#nextPipes = [];
        for (let i = 0; i < this.#pipesToShow; i++) {
            this.#nextPipes.push(this.#generatePipe());
        }

        //set up the display
        this.#displaySprites = [];
        for (let i = 0; i < this.#pipesToShow; i++) {
            const pipe = this.#nextPipes[i];
            const sprite = Sprite.from(pipe.type);
            const screenPosition = {
                x: screenWidth * screenWidthRatio,
                y: screenHeight * screenHeightRatio - (i * this.#displayScale * cellSize) - (i * displayOffset)
            };
            setupSprite(sprite, screenPosition, pipe.rotation, this.#displayScale);
            this.#stageInterface.addToStage(sprite);
            this.#displaySprites.push(sprite);
        }
    }

    //need to improve this
    #generatePipe() {
        const rotation = (Math.floor(Math.random() * 4)) * 90;
        const type = this.#pipeChoices[Math.floor(Math.random() * this.#pipeChoices.length)];

        // [up, down, left, right], 0 means no opening
        let openings = [0, 0, 0, 0];

        if (type === CellType.cross) {
            openings = [1, 1, 1, 1];
        }
        else if (type === CellType.pipe) {
            if (rotation === 0 || rotation === 180) {
                openings = [1, 1, 0, 0];
            }
            else if (rotation === 90 || rotation === 270) {
                openings = [0, 0, 1, 1];
            }
        }
        else {
            if (rotation === 0) {
                openings = [1, 0, 0, 1];
            }
            else if (rotation === 90) {
                openings = [0, 1, 0, 1];
            }
            else if (rotation === 180) {
                openings = [0, 1, 1, 0];
            }
            else if (rotation === 270) {
                openings = [1, 0, 1, 0];
            }
        }

        const pipe = {
            type: type,
            rotation: rotation,
            openings: openings
        };
        return pipe;
    }

    #updateDisplay() {
        const toRemove = this.#displaySprites.shift()
        let screenPos = { x: toRemove.position.x, y: toRemove.position.y };
        this.#stageInterface.removeFromStage(toRemove);
        for (let sprite of this.#displaySprites) {
            let oldScreenPos = { x: sprite.position.x, y: sprite.position.y };
            sprite.position.x = screenPos.x;
            sprite.position.y = screenPos.y;
            screenPos = oldScreenPos;
        }
        const nextPipe = this.#nextPipes[this.#nextPipes.length - 1];
        const sprite = Sprite.from(nextPipe.type);
        setupSprite(sprite, screenPos, nextPipe.rotation, this.#displayScale);
        this.#stageInterface.addToStage(sprite);
        this.#displaySprites.push(sprite);
    }

    getNextPipe() {
        const pipe = this.#nextPipes.shift();
        this.#nextPipes.push(this.#generatePipe());
        this.#updateDisplay();
        
        return pipe;
    }
}