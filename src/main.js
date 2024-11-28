import { Game } from './game.js';

(async () =>
{
    const game = new Game();
    await game.init();
    game.startGame();
})();
