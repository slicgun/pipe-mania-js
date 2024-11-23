import { Application, Assets, Sprite } from 'pixi.js';
import { Grid } from './grid.js';
import { Game } from './game.js';

// Asynchronous IIFE
(async () =>
{
    // Create a PixiJS application.
    const game = new Game();
    await game.init();
    await game.loadAssets();
    
    const grid = new Grid(game, game.app.screen.width / 2, game.app.screen.height / 2);

    game.app.ticker.add((time) =>
    {
    });
})();
