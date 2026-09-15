/**
 * auth.js — small, friendly auth UI helpers
 * - wires the login button and shutdown/restart controls
 * - performs simple fade-in/out animations and plays sounds
 * Keep this simple: it's just UI glue, not real security.
 */

import { playSound } from './sound.js';

const loginScreen = document.getElementById('login-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const desktopScreen = document.getElementById('desktop-screen');
const userBtn = document.getElementById('user-login-btn');

// Initialize auth UI: hook login and power buttons
export function initAuth() {
    // clicking the user card performs login
    userBtn.addEventListener('click', performLogin);
    
    // Handle Shut down / Restart buttons
    document.getElementById('login-shutdown-btn').onclick = shutDown;
    document.getElementById('start-shutdown').onclick = shutDown;
    document.getElementById('start-restart').onclick = restart;
}

// Perform the simple login animation flow (click -> welcome -> desktop)
function performLogin() {
    playSound('click');
    
    loginScreen.style.opacity = '0';
    setTimeout(() => {
        loginScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.style.opacity = '1';
        
        // Show welcome for a short time, then reveal desktop
        setTimeout(() => {
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.classList.add('hidden');
                desktopScreen.classList.remove('hidden');
                desktopScreen.style.opacity = '1';
                // Play startup sound now that desktop is visible
                playSound('startup');
            }, 500);
        }, 2000);
    }, 500);
}

// Do a simple shutdown animation: play sound, grey out, then blackout and reload
function shutDown() {
    playSound('shutdown');
    document.body.style.filter = 'grayscale(100%)';
    setTimeout(() => {
        document.body.innerHTML = ''; // Blackout
        document.body.style.background = 'black';
        setTimeout(() => location.reload(), 2000); // Simple reload simulation
    }, 1500);
}

// Restart behaves like shutdown but simply reloads after the sound
function restart() {
    playSound('shutdown');
    setTimeout(() => {
        location.reload();
    }, 1500);
}