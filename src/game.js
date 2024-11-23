import { Application, Assets, Sprite } from 'pixi.js';

export class Game {
    constructor() {
        this.app = new Application();
        
    }
    async init() {
        await this.app.init({ background: '#1099bb', resizeTo: window });
        document.body.appendChild(this.app.canvas);
    }

    async loadAssets() {
        const assets = [];
        assets.push({ alias: 'empty', src: 'assets/textures/empty.png' });
        await Assets.load(assets);
    }

    addToStage(sprite) {
        this.app.stage.addChild(sprite);
    }

    removeFromStage(sprite) {
        this.app.stage.removeChild(sprite);
    }
}