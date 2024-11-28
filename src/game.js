import { Application, Assets, } from 'pixi.js';
import { PipeGenerator } from './pipeGenerator';
import { Grid } from './grid.js';
import { StageInterface } from './stageInterface.js';
import { WaterManager } from './waterManager.js';
import { createText } from './utils.js';

export class Game {
    #app;
    #pipeGenerator;
    #stageInterface;
    #waterManager;
    #grid;
    #resultText;
    #scoreText;
    #goalText;

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
        
        this.#stageInterface = new StageInterface(this.#app.stage);
        this.#pipeGenerator = new PipeGenerator(this.#app.screen.width, this.#app.screen.height, this.#stageInterface);
        this.#waterManager = new WaterManager(waterManagerCallbacks, this.#app.screen.width, this.#app.screen.height);

        this.#initGrid();
        this.#initUI();
        
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
        this.#scoreText.text = `score: ${score}`;
    }

    onGameFinish(win) {
        if (win) {
            this.#resultText.text = "you win!";
        }
        else {
            this.#resultText.text = "you lose!";
        }
        this.#app.stage.addChild(this.#resultText);
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

    #initUI() {
        this.#resultText = createText();
        this.#resultText.anchor.set(0.5);
        this.#resultText.x = this.#app.screen.width * 0.5;
        this.#resultText.y = this.#app.screen.height * 0.05;

        this.#scoreText = createText();
        this.#scoreText.x = this.#app.screen.width * 0.15;
        this.#scoreText.y = this.#app.screen.height * 0.3;
        this.#scoreText.text = "score: 0";
        this.#app.stage.addChild(this.#scoreText);
        
        
        this.#goalText = createText();
        this.#goalText.x = this.#app.screen.width * 0.15;
        this.#goalText.y = this.#app.screen.height * 0.1;
        this.#goalText.text = `goal: ${this.#waterManager.getGoal()}`;
        this.#app.stage.addChild(this.#goalText);
    }
}