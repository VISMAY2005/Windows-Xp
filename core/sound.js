/* sound.js — small helper for playing UI sounds
   Usage: import { playSound } from './sound.js' and call with keys like 'click' or 'startup'. */

const sounds = {
    startup: new Audio('./assets/sounds/startup.mp3'),
    shutdown: new Audio('./assets/sounds/shutdown.mp3'),
    click: new Audio('./assets/sounds/click.mp3'),
    desktop: new Audio('./assets/sounds/desktop.mp3') // Optional ambience
};

// Play a named sound from the sounds map. Safe to call even if sound is missing.
export const playSound = (name) => {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log("Audio autoplay blocked until interaction"));
    }
};