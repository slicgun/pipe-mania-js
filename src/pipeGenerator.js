

export class PipeGenerator {
    #pipeChoices;
    #game;
    #nextPipes;

    constructor(game) {
        this.#pipeChoices = ['pipe', 'curved', 'cross'];
        this.#game = game;
        this.#nextPipes = [];

        for (let i = 0; i < 4; i++) {
            this.#nextPipes.push(this.#generatePipe());
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

    getNextPipe() {
        const pipe = this.#nextPipes.shift();
        this.#nextPipes.push(this.#generatePipe());
        
        return pipe;
    }
}