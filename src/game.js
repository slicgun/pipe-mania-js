import { Application, Assets, Sprite } from 'pixi.js';
import { PipeGenerator } from './pipeGenerator';
import { Grid } from './grid.js';
import { StageInterface } from './stageInterface.js';

export class Game {
    constructor() {
        this.app = new Application();
    }
    
    async init() {
        await this.#loadAssets();
        await this.app.init({ background: '#1099bb', resizeTo: window });
        document.body.appendChild(this.app.canvas);
        
        this.pipeGenerator = new PipeGenerator(this);
        this.stageInterface = new StageInterface(this.app.stage);
        this.grid = new Grid(this.stageInterface,
            this.app.screen.width / 2, this.app.screen.height / 2,
            this.pipeGenerator.getNextPipe.bind(this.pipeGenerator));
    }

    async #loadAssets() {
        const assets = [];
        assets.push({ alias: 'empty', src: 'assets/textures/empty.png' });
        assets.push({ alias: 'pipe', src: 'assets/textures/pipe.png' });
        assets.push({ alias: 'cross', src: 'assets/textures/cross.png' });
        assets.push({ alias: 'curved', src: 'assets/textures/curved.png' });
        assets.push({ alias: 'blocked', src: 'assets/textures/blocked.png' });
        assets.push({ alias: 'start', src: 'assets/textures/start.png' });
        await Assets.load(assets);
    }

    addToStage(sprite) {
        this.app.stage.addChild(sprite);
    }

    removeFromStage(sprite) {
        this.app.stage.removeChild(sprite);
    }
}