

export class StageInterface {
    #stage;

    constructor(stage) {
        this.#stage = stage;
    }

    addToStage(sprite) {
        this.#stage.addChild(sprite);
    }

    removeFromStage(sprite) {
        this.#stage.removeChild(sprite);
    }
}