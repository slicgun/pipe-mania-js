import { Application, Assets, } from 'pixi.js';
import { PipeGenerator } from './pipeGenerator';
import { Grid } from './grid.js';
import { StageInterface } from './stageInterface.js';
import { WaterManager } from './waterManager.js';
import { UI } from './UI.js';

export class Game {
    #app;
    #pipeGenerator;
    #stageInterface;
    #waterManager;
    #grid;
    #resultText;
    #scoreText;
    #goalText;
    #ui;

    static isPlaying = false;

    constructor() {
        this.#app = new Application();
    }
    
    async init() {
        await this.#loadAssets();
        await this.#app.init({ background: '#722F37', resizeTo: window });
        document.body.appendChild(this.#app.canvas);

        const waterManagerCallbacks = {
            onGameEnd: this.onGameFinish.bind(this),
            onTick: this.updateScore.bind(this)
        };
        
        const screenWidth = this.#app.screen.width;
        const screenHeight = this.#app.screen.height;

        this.#stageInterface = new StageInterface(this.#app.stage);
        this.#pipeGenerator = new PipeGenerator(screenWidth, screenHeight, this.#stageInterface);
        this.#waterManager = new WaterManager(waterManagerCallbacks, screenWidth, screenHeight);

        this.#initGrid();
        this.#ui = new UI(screenWidth, screenHeight, this.#stageInterface, this.#waterManager.getGoal());
        //this.#initUI();
        
        this.#waterManager.startCell = this.#grid.getCell(this.#grid.getStartPosition());
        this.#waterManager.grid = this.#grid;
    }

    async #loadAssets() {
        const assets = [];
        assets.push({ alias: 'empty', src: 'assets/textures/empty.png' });
        assets.push({ alias: 'pipe', src: 'assets/textures/pipe.png' });
        assets.push({ alias: 'cross', src: 'assets/textures/cross.png' });
        assets.push({ alias: 'curved', src: 'assets/textures/curved.png' });
        assets.push({ alias: 'blocked', src: 'assets/textures/blocked.png' });
        assets.push({ alias: 'start', src: 'assets/textures/start.png' });

        try {
            await Assets.load(assets);
        } catch (error) {
            console.error("failed to load assets:", error);
            alert("error loading assets. please try again.");
        }
    }

    updateScore(score) {
        this.#ui.updateScore(score);
    }

    onGameFinish(win) {
        this.#ui.showResult(win);
    }

    #initGrid() {
        const gridCallbacks = {
            firstPipePlaced: this.#waterManager.beginFlow.bind(this.#waterManager),
            addToWaterManager: this.#waterManager.checkForSourceConnections.bind(this.#waterManager),
            getNextPipe: this.#pipeGenerator.getNextPipe.bind(this.#pipeGenerator),
        };

        this.#grid = new Grid(this.#stageInterface,
            this.#app.screen.width / 2, this.#app.screen.height / 2,
            gridCallbacks);
    }
}