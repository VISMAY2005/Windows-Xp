/**
 * boot.js — handles the app boot sequence and initial UI setup
 * - fades the boot screen, shows the login, and initializes subsystems
 * - adds desktop icons and exposes openWindow for global usage
 */
import { initAuth } from './auth.js';
import { initClock } from './clock.js';
import { initStartMenu } from './startmenu.js';
import { initSearch } from './search.js';
import { openWindow } from './windowManager.js';
import { apps } from './state.js';

// DOM Elements
const bootScreen = document.getElementById('boot-screen');
const loginScreen = document.getElementById('login-screen');
const desktopIcons = document.getElementById('desktop-icons');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Run Boot Sequence
    setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            loginScreen.style.opacity = '1';
        }, 500);
    }, 2500); // 2.5s Boot time

    // 2. Initialize Subsystems
    initAuth();
    initClock();
    initStartMenu();
    initSearch();
    renderDesktopIcons();
});

// Render desktop shortcuts. Each icon opens the app on double-click (or tap on mobile).
function renderDesktopIcons() {
    // We add 'wolfenstein' and 'snake' here to create the icons
    const shortcuts = ['about', 'projects', 'wolfenstein', 'snake'];
    
    shortcuts.forEach(appId => {
        const app = apps[appId];
        if (!app) return; // Safety check

        const iconDiv = document.createElement('div');
        iconDiv.className = 'desktop-icon';
        iconDiv.innerHTML = `
            <img src="${app.icon}" onerror="this.style.display='none'">
            <div style="width:32px;height:32px;background:#ccc;margin:0 auto; display:none" class=\"fallback-icon\"></div>
            <span>${app.title}</span>
        `;
        
        // Handle double click to open the window
        iconDiv.addEventListener('dblclick', () => {
            console.log("Opening:", appId);
            openWindow(appId);
        });

        // Touch support for mobile — single tap behavior can be added here
        iconDiv.addEventListener('touchstart', (e) => {
            // Optional: add logic here for single tap on mobile
        });

        desktopIcons.appendChild(iconDiv);
    });
}
// Add this at the end of boot.js
window.openWindow = openWindow;