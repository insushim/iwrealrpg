import App from './app';
import Game from './game';
import Weather from './renderer/effects/weather';

import './lib/i18n';
import './lib/sentry';

/**
 * The entry point for the game. Create an instance of the game
 * and pass a new instance of the app onto it.
 */

window.addEventListener('load', () => {
    new Game(new App());

    // Remaster: start ambient floating particles after the game canvas is ready.
    setTimeout(() => {
        let weather = new Weather();

        weather.startAmbient();
    }, 2500);
});
