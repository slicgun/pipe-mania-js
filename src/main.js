import { Application, Assets, Sprite } from 'pixi.js';
import { Grid } from './grid.js';
import { Game } from './game.js';

// Asynchronous IIFE
(async () =>
{
    const game = new Game();
    await game.init();

    game.app.ticker.add((time) =>
    {
    });
})();
