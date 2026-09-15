/**
 * startmenu.js — controls the Start Menu UI
 * - toggles menu visibility, wires app links and external links
 * - keeps things lightweight and easy to follow
 */
import { state } from './state.js';
import { openWindow } from './windowManager.js';

const startMenu = document.getElementById('start-menu');
const startBtn = document.getElementById('start-btn');
const searchInput = document.getElementById('start-search');

export function initStartMenu() {
    // Toggle Menu when start button is clicked
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    // Close on outside click to improve UX
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startBtn && state.isStartMenuOpen) {
            toggleStartMenu(false);
        }
    });

    // Wire app links in the start menu to open windows
    document.querySelectorAll('.start-item').forEach(item => {
        item.addEventListener('click', () => {
            const appId = item.dataset.app;
            openWindow(appId);
            toggleStartMenu(false);
        });
    });

    // External links ask for confirmation and open in a new tab
    document.querySelectorAll('.external-link').forEach(link => {
        link.addEventListener('click', () => {
            const url = link.dataset.url;
            if(confirm(`Are you sure you want to go to ${url}?`)) {
                window.open(url, '_blank');
            }
            toggleStartMenu(false);
        });
    });

    // Search focus/blur behavior is handled by the search module if needed

}

// Toggle visual state and store flag in shared state
function toggleStartMenu(forceState) {
    state.isStartMenuOpen = forceState !== undefined ? forceState : !state.isStartMenuOpen;
    if (state.isStartMenuOpen) {
        startMenu.classList.remove('hidden');
        startBtn.classList.add('active'); // CSS style needed for active button state
    } else {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
    }
}