import { Text, TextStyle } from 'pixi.js';

function createText() {
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fill: '#ffffff',
        align: 'center',
        stroke: '#0000ff',
        strokeThickness: 4
    });

    const text = new Text("", style);
    text.anchor.set(0.5);
    return text;
}

export class UI {
    #resultText;
    #scoreText;
    #goalText;
    #stageInterface;

    constructor(screenWidth, screenHeight, stageInterface, goal) {
        this.#stageInterface = stageInterface;
        this.#resultText = createText();
        this.#resultText.anchor.set(0.5);
        this.#resultText.x = screenWidth * 0.5;
        this.#resultText.y = screenHeight * 0.05;

        this.#scoreText = createText();
        this.#scoreText.x = screenWidth * 0.15;
        this.#scoreText.y = screenHeight * 0.3;
        this.#scoreText.text = "score: 0";
        this.#stageInterface.addToStage(this.#scoreText);
        
        this.#goalText = createText();
        this.#goalText.x = screenWidth * 0.15;
        this.#goalText.y = screenHeight * 0.1;
        this.#goalText.text = `goal: ${goal}`;
        this.#stageInterface.addToStage(this.#goalText);
    }

    updateScore(score) {
        this.#scoreText.text = `score: ${score}`;
    }

    showResult(win) {
        if (win) {
            this.#resultText.text = "you win!";
        }
        else {
            this.#resultText.text = "you lose!";
        }
        this.#stageInterface.addToStage(this.#resultText);
    }
}