import { Game } from './game.js';

(async () =>
{
    const game = new Game();
    await game.init();
})();

// todo:
// add the gameplay loop
// add the animations
// clean up code