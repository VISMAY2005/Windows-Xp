/**
 * state.js — small shared state for the demo OS
 * - `state` holds runtime flags and window metadata
 * - `apps` lists available desktop apps and basic settings
 */
export const state = {
    // whether the user has signed in
    isLoggedIn: false,
    // list of open windows (for richer state tracking if needed)
    windows: [], 
    // id of currently focused window
    activeWindowId: null,
    // base z-index counter for stacking windows
    zIndexCounter: 100,
    // start menu visibility flag
    isStartMenuOpen: false
};

export const apps = {
    // appId: { title, icon, width, height }
    'about': { title: 'About Me', icon: './assets/images/about.png', width: 500, height: 600 },
    'projects': { title: 'My Projects', icon: './assets/images/projects.png', width: 700, height: 500 },
    'contact': { title: 'Contact Me', icon: './assets/images/email.png', width: 450, height: 400 },
    'resume': { title: 'Resume', icon: './assets/images/resume.png', width: 800, height: 600 },
    'wolfenstein': { title: 'Wolfenstein', icon: './assets/images/wolf-icon.png', width: 640, height: 480 },
    'snake': { title: 'Snake XP', icon: './assets/images/snake-icon.png', width: 340, height: 430 }
};