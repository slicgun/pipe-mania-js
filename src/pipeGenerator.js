import { Sprite } from "pixi.js";
import { cellSize } from "./cell";
import { setupSprite } from "./utils";


export class PipeGenerator {
    #pipeChoices;
    #game;
    #nextPipes;
    #displaySprites;
    #pipesToShow;
    #displayScale;

    constructor(game) {
        this.#displayScale = 2;
        this.#pipesToShow = 4;
        this.#pipeChoices = ['pipe', 'curved', 'cross'];
        this.#game = game;
        this.#nextPipes = [];

        for (let i = 0; i < this.#pipesToShow; i++) {
            this.#nextPipes.push(this.#generatePipe());
        }

        //set up the display
        let offset = 16;
        this.#displaySprites = [];
        for (let i = 0; i < this.#pipesToShow; i++) {
            const pipe = this.#nextPipes[i];
            const sprite = Sprite.from(pipe.type);
            const screenPosition = {
                x: this.#game.app.screen.width * 0.05,
                y: this.#game.app.screen.height * 0.6 - (i * this.#displayScale * cellSize) - (i * offset)
            };
            setupSprite(sprite, screenPosition, pipe.rotation, this.#displayScale);
            this.#game.app.stage.addChild(sprite);
            this.#displaySprites.push(sprite);
        }
    }

    #generatePipe() {
        const rotation = (Math.floor(Math.random() * 4) + 1) * 90;
        const type = Math.floor(Math.random() * this.#pipeChoices.length);
        const pipe = {
            type: this.#pipeChoices[type],
            rotation: rotation
        };
        return pipe;
    }

    #updateDisplay() {
        const toRemove = this.#displaySprites.shift()
        let screenPos = { x: toRemove.position.x, y: toRemove.position.y };
        this.#game.app.stage.removeChild(toRemove);
        for (let sprite of this.#displaySprites) {
            let oldScreenPos = { x: sprite.position.x, y: sprite.position.y };
            sprite.position.x = screenPos.x;
            sprite.position.y = screenPos.y;
            screenPos = oldScreenPos;
        }
        const nextPipe = this.#nextPipes[this.#nextPipes.length - 1];
        const sprite = Sprite.from(nextPipe.type);
        setupSprite(sprite, screenPos, nextPipe.rotation, this.#displayScale);
        this.#game.app.stage.addChild(sprite);
        this.#displaySprites.push(sprite);
    }

    getNextPipe() {
        const pipe = this.#nextPipes.shift();
        this.#nextPipes.push(this.#generatePipe());
        this.#updateDisplay();
        
        return pipe;
    }
}