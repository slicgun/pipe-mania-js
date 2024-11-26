import { Application, Assets, Sprite } from 'pixi.js';
import { PipeGenerator } from './pipeGenerator';
import { Grid } from './grid.js';
import { StageInterface } from './stageInterface.js';
import { WaterManager } from './waterManager.js';

export class Game {
    static isPlaying = false;

    constructor() {
        this.app = new Application();
    }
    
    async init() {
        await this.#loadAssets();
        await this.app.init({ background: '#722F37', resizeTo: window });
        document.body.appendChild(this.app.canvas);
        
        this.pipeGenerator = new PipeGenerator(this);
        this.stageInterface = new StageInterface(this.app.stage);
        this.waterManager = new WaterManager();

        const callbacks = {
            firstPipePlaced: this.waterManager.beginFlow.bind(this.waterManager),
            addToWaterManager: this.waterManager.addCell.bind(this.waterManager),
            getNextPipe: this.pipeGenerator.getNextPipe.bind(this.pipeGenerator),
        };

        this.grid = new Grid(this.stageInterface,
            this.app.screen.width / 2, this.app.screen.height / 2,
            callbacks);
        
        this.waterManager.startCell = this.grid.getCell(this.grid.startPos);
        this.waterManager.grid = this.grid;
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