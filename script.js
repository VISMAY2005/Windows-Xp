/*
 * script.js — main glue for the demo OS
 * - holds simple sound helpers, boot sequence, start menu and basic window manager hooks
 * - small, easy-to-read functions for demo interactions
 */

/* ==================================================================
   APP REGISTRY — the single place to add/edit apps.
   type: 'builtin' -> custom HTML handled inside openWindow() (About,
                       Contact, Projects, Resume, Fav Quote, Snake)
   type: 'iframe'  -> loads `url` inside an OS window automatically,
                       with a toolbar + "Open in new tab" fallback.
                       To add a new link-based app: add one entry here
                       (title, icon, url) and call openWindow('key')
                       from any icon/menu item — nothing else to touch.
   ================================================================== */
const APPS = {
    about:       { title: 'About Me',      icon: './assets/images/about.png',    type: 'builtin' },
    contact:     { title: 'Contact Me',    icon: './assets/images/email.png',    type: 'builtin' },
    projects:    { title: 'My Projects',   icon: './assets/images/projects.png', type: 'builtin' },
    resume:      { title: 'My Resume',     icon: './assets/images/resume.png',   type: 'builtin' },
    wolfenstein: { title: 'Fav Quote',     icon: './assets/images/wolfenstein-icon.png', type: 'builtin' },
    snake:       { title: 'Snake',         icon: './assets/images/snake-icon.png', type: 'builtin' },

    chrome:      { title: 'Google Chrome', icon: './assets/images/chrome.png',   type: 'iframe', url: 'https://www.google.com/' },
    linkedin:    { title: 'LinkedIn',      icon: './assets/images/linkedin.png', type: 'iframe', url: 'https://www.linkedin.com/in/vismay-rao-bn-22ba78376/' },
    instagram:   { title: 'Instagram',     icon: './assets/images/insta.png',    type: 'iframe', url: 'https://www.instagram.com/vismay._.1431/' },
    github:      { title: 'GitHub',        icon: './assets/images/github.png',   type: 'iframe', url: 'https://github.com/VISMAY2005' }
};

/* ==================================================================
   WELCOME BALLOON — the XP-style tray tip shown after the desktop
   loads (inspired by MitchIvin XP). Edit text/timing here only.
   icon: drop a small (16x16-ish) info icon at this path.
   ================================================================== */
const BALLOON_CONFIG = {
    icon: './assets/images/balloon-info.png',
    title: 'Hi there!',
    message: "I'm Vismay Rao BN, and this is my portfolio.",
    bullets: [
        'Double-click an icon to get started',
        'Or open a program from the Start menu'
    ],
    tip: 'Tip: Right-click for context menus.',
    delayMs: 1200,     // how long after the desktop appears before it shows
    autoHideMs: 0   // 0 = stays until the user closes it
};

/* 
   PROJECTS — the My Projects gallery. Add a new project by adding
   one entry here; nothing else needs to change.
   image: put a screenshot at this path (any size, it gets cropped
   to fit); if the file is missing the card just falls back to a
   plain gradient tile, so it's safe to leave unfilled for now.
   description: shown on the detail page 
    */
const PROJECTS = [
    {
        title: 'Netflix Clone',
        image: './assets/images/project-netflix.png',
        url: 'https://github.com/VISMAY2005/Netflix-Clone',
        brief: 'A front-end clone of the Netflix browsing UI.',
        description: 'This project is a front-end clone of the Netflix browsing UI, built using HTML, CSS, and JavaScript. It replicates the layout and design of the Netflix homepage, including the navigation bar, movie thumbnails, and responsive design. Through this project, I learned about web development best practices, responsive design techniques, and how to create a visually appealing user interface.'
    },
    {
        title: 'Meesho Clone',
        image: './assets/images/project-meesho.png',
        url: 'https://github.com/VISMAY2005/Meesho-Clone',
        brief: 'A front-end clone of the Meesho shopping app.',
        description: 'This project is a front-end clone of the Meesho shopping app, built using HTML, CSS, and JavaScript. It replicates the layout and design of the Meesho homepage, including the navigation bar, product listings, and responsive design. Through this project, I learned about web development best practices, responsive design techniques, and how to create a visually appealing user interface.'
    },
    {
        title: 'Paytm Clone',
        image: './assets/images/project-paytm.png',
        url: 'https://github.com/VISMAY2005/Paytm-Clone',
        brief: 'A front-end clone of the Paytm payments UI.',
        description: 'This project is a front-end clone of the Paytm payments UI, built using HTML, CSS, and JavaScript. It replicates the layout and design of the Paytm payment page, including the navigation bar, payment options, and responsive design. Through this project, I learned about web development best practices, responsive design techniques, and how to create a visually appealing user interface.'
    },
    {
        title: 'Agri-Predict',
        image: './assets/images/project-agri.png',
        url: 'https://github.com/VISMAY2005/Agri-Predict-An-Crop-Yeild-Predictor',
        brief: 'A crop-yield prediction tool.',
        description: 'This project is a crop-yield prediction tool, built using Python and machine learning algorithms. It analyzes various factors such as weather data, soil conditions, and historical yield data to predict future crop yields. Through this project, I learned about data analysis, machine learning techniques, and how to build predictive models.'
    },
    {
         title: 'Agri-Predict -V2',
        image: './assets/images/project-agriv2.png',
        url: 'https://github.com/VISMAY2005/AgriPred--v2.0',
        brief: 'A crop-yield prediction tool.',
        description: 'AgriPredict is an AI-based crop prediction and simulation system designed to provide data-driven agricultural insights. Unlike the previous version, it integrates FAOSTAT data to build realistic agricultural scenarios using factors such as temperature, rainfall, irrigation, fertilizer usage, soil quality, and pest pressure. It uses a stacked ensemble of XGBoost, Random Forest, and Ridge Regression to predict crop yield and production, calculate confidence scores, and recommend the top 5 suitable crops. The system also provides an interactive Streamlit dashboard for easy simulation and analysis..'
    },
    {
        title: 'Sign Lang CNN',
        image: './assets/images/project-sign.png',
        url: 'https://github.com/VISMAY2005/SIGN-LANGUAGE-USING-MediaPipe-and-CNN',
        brief: 'Sign-language recognition using MediaPipe and a CNN.',
        description: 'This project is a sign-language recognition system, built using MediaPipe for hand tracking and a Convolutional Neural Network (CNN) for classification. It can recognize various sign languages in real-time. Through this project, I learned about computer vision, deep learning, and how to build real-time applications.'
    },
    {
        title: 'Valentine Proposal',
        image: './assets/images/project-valentine.png',
        url: 'https://github.com/VISMAY2005/Valentine-Proposal-',
        brief: 'A creative way to propose to someone special.',
        description: 'This project is a creative way to propose to someone special, built using HTML, CSS, and JavaScript. It features a romantic design and interactive elements to make the proposal memorable. Through this project, I learned about web development best practices, responsive design techniques, and how to create a visually appealing user interface.'
    },
    {
        title: 'Windows XP Portfolio',
        image: './assets/images/project-xp.png',
        url: 'https://github.com/VISMAY2005/Windows-XP-Portfolio',
        brief: 'A portfolio website inspired by Windows XP.',
        description: 'This project is a portfolio website inspired by the classic Windows XP interface, built using HTML, CSS, and JavaScript. It features a nostalgic design with interactive elements reminiscent of the original OS. Through this project, I learned about web development best practices, responsive design techniques, and how to create a visually appealing user interface. Still in progress, I am continuously adding more features and content to showcase my skills and projects.'
    }
];

/* ==================================================================
   CHROME_ICONS — icons used by the reusable browser-chrome toolbar
   (About Me / My Projects toolbars, nav buttons, address bar).
   Drop matching files from your XP icon pack at these paths.
   Back/Forward/Favorites are decorative (no browsing history to
   go back to), Home/Theme are functional.
   ================================================================== */
const CHROME_ICONS = {
    back: './assets/images/nav-back.png',
    forward: './assets/images/nav-forward.png',
    home: './assets/images/nav-home.png',
    favorites: './assets/images/nav-favorites.png',
    theme: './assets/images/nav-theme.png',
    ie: './assets/images/ie-icon.png'
};

/* ==================================================================
   WINDOW_CONTROL_ICONS — the minimize/maximize/close buttons on every
   window's title bar. Point these at your icon pack's UI folder.
   If a file is missing it falls back to the plain text glyph, so
   it's safe to fill these in one at a time.
   ================================================================== */
const WINDOW_CONTROL_ICONS = {
    minimize: './assets/images/UI/minimize.png',
    maximize: './assets/images/UI/maximize.png',
    close: './assets/images/UI/close.png'
};

/* --- STATE & SOUNDS --- */
const sounds = {
    startup: document.getElementById('sound-startup'),
    shutdown: document.getElementById('sound-shutdown'),
    click: document.getElementById('sound-click')
};

// Play a UI sound by name; ignores missing sounds and handles autoplay blocks
function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log("Audio blocked:", e));
    }
}

/* --- BOOT SEQUENCE --- */
// Boot: hide the boot screen after a timeout, show login, and start the clock
window.onload = function () {
    setTimeout(() => {
        document.getElementById('boot-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }, 4000);

    updateClock();
    setInterval(updateClock, 1000);
};

/* --- LOGIN LOGIC --- */
// Simple login flow: show welcome, then desktop and play startup sound
function loginUser() {
    playSound('click');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');

    // Welcome delay
    setTimeout(() => {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        // Play startup sound now that the desktop is visible
        playSound('startup');
        // Show the XP-style welcome balloon near the tray
        setTimeout(showWelcomeBalloon, BALLOON_CONFIG.delayMs);
    }, 3000);
}

// Quick shutdown that replaces the whole page with a message
function triggerShutdown() {
    playSound('shutdown');
    document.body.innerHTML = '<div style="width:100%;height:100%;background:black;display:flex;align-items:center;justify-content:center;color:white;">It is now safe to turn off your computer.</div>';
}

// Alternative shutdown that waits for the sound, then shows a nicer message
function triggerShutdown() {
    // 1. Play the sound first
    playSound('shutdown');

    // 2. show a friendly message after a short delay so the sound can play
    setTimeout(() => {
        document.body.innerHTML = `
            <div style="width:100%; height:100%; background:black; display:flex; 
                        align-items:center; justify-content:center; color:white; 
                        font-family:Tahoma; font-size:18px;">
                It is now safe to turn off your computer.<br><br>
                Thankyou for using Vismay's Portfolio OS.<br><br>
                Refresh using f5 to restart.<br>
                <img src="./assets/images/profile.jpeg" alt="Powered by Darkcelerium" 
                style="margin-top:20px;
                 width:100px; 
                 height:100px;
                 margin-left:100px;
                 border-radius:30%;
                 box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);">
            </div>`;
    }, 2000); //  i have adjusted to 2 second for proper shutdown sound play
}

/* --- WELCOME BALLOON (tray tip) --- */
// Builds and shows the balloon defined in BALLOON_CONFIG above.
function showWelcomeBalloon() {
    if (document.getElementById('xp-balloon')) return; // already showing

    const cfg = BALLOON_CONFIG;
    const bulletsHTML = (cfg.bullets && cfg.bullets.length)
        ? `<ul>${cfg.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
        : '';

    const balloon = document.createElement('div');
    balloon.id = 'xp-balloon';
    balloon.className = 'xp-balloon';
    balloon.innerHTML = `
        <div class="xp-balloon-header">
            <img src="${cfg.icon}" onerror="this.style.display='none'">
            <span class="xp-balloon-title">${cfg.title}</span>
            <span class="xp-balloon-close" onclick="closeBalloon()">&times;</span>
        </div>
        <div class="xp-balloon-body">
            ${cfg.message}
            ${bulletsHTML}
        </div>
        ${cfg.tip ? `<div class="xp-balloon-tip">${cfg.tip}</div>` : ''}
    `;
    document.body.appendChild(balloon);

    if (cfg.autoHideMs > 0) {
        setTimeout(closeBalloon, cfg.autoHideMs);
    }
}

// Removes the balloon if present (safe to call more than once)
function closeBalloon() {
    const balloon = document.getElementById('xp-balloon');
    if (balloon) balloon.remove();
}

/* --- CLOCK --- */
// Update the clock in the UI (shows hours:minutes)
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* --- START MENU --- */
// Toggle start menu visibility
function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-btn');
    menu.classList.toggle('hidden');
}

// Close menu when clicking outside it (keeps UX tidy)
document.addEventListener('click', (e) => {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-btn');
    if (!menu.contains(e.target) && !btn.contains(e.target) && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        resetStartMenuSearch();
    }
});

/* --- START MENU SEARCH (filters the Start Menu's own item list) ---
   Typing in #start-search shows only matching entries inside the Start
   Menu itself (Internet, Projects, About Me, LinkedIn, etc.) and hides
   the rest. The desktop underneath is untouched. Clearing the box
   restores the full menu.
*/
function filterStartMenuItems(query) {
    const q = query.trim().toLowerCase();
    const items = document.querySelectorAll('#start-menu .start-item');
    const dividers = document.querySelectorAll('#start-menu .line');
    let matchCount = 0;
    let lastMatch = null;

    items.forEach(item => {
        const name = item.textContent.trim().toLowerCase();
        const matches = q === '' || name.includes(q);

        item.style.display = matches ? 'flex' : 'none';

        if (matches && q !== '') {
            matchCount++;
            lastMatch = item;
        }
    });

    // Hide the section dividers while actively filtering so we don't
    // leave stray separator lines between hidden items
    dividers.forEach(divider => {
        divider.style.display = q === '' ? '' : 'none';
    });

    return { matchCount, singleMatch: matchCount === 1 ? lastMatch : null };
}

// Clears the search box and restores the full Start Menu item list
function resetStartMenuSearch() {
    const searchInput = document.getElementById('start-search');
    if (searchInput) searchInput.value = '';
    filterStartMenuItems('');
}

function initSearchBox() {
    const searchInput = document.getElementById('start-search');
    if (!searchInput) return;

    // Live filter as the user types
    searchInput.addEventListener('input', (e) => {
        filterStartMenuItems(e.target.value);
    });

    // Pressing Enter activates the entry if the search narrowed it down to exactly one
    searchInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const { singleMatch } = filterStartMenuItems(searchInput.value);
        if (singleMatch && typeof singleMatch.onclick === 'function') {
            singleMatch.onclick();
            document.getElementById('start-menu').classList.add('hidden');
            resetStartMenuSearch();
        }
    });
}

document.addEventListener('DOMContentLoaded', initSearchBox);

/* --- WINDOW MANAGER --- */
let zIndex = 100;

function openWindow(app) {
    const area = document.getElementById('window-area');
    const id = 'win-' + Date.now();
    zIndex++;

    // Create Window HTML
    const win = document.createElement('div');
    win.className = 'window';
    win.id = id;
    win.style.left = '50px';
    win.style.top = '30px';
    win.style.width = '600px';
    win.style.height = '450px';
    win.style.zIndex = zIndex;

    // Content based on app (ADD YOUR CONTENT/INFORMATION HERE)
    let title = 'Program';
    let contentHTML = '';
    const appConfig = APPS[app];

    // Generic handler: any app registered above with type 'iframe' opens
    // its URL inside this window automatically — no per-app code needed.
    if (appConfig && appConfig.type === 'iframe') {
        title = appConfig.title;
        contentHTML = buildIframeWindow(id, appConfig.url, appConfig.title);
    } else if (app === 'about') {
        title = 'About Me';
        contentHTML = buildBrowserChrome({
            addressText: 'About Me',
            toolbarLinks: [
                { icon: APPS.projects.icon, label: 'My Projects', onclick: "openWindow('projects')" },
                { icon: APPS.resume.icon,   label: 'My Resume',   onclick: "openWindow('resume')" }
            ],
            bodyHTML: `
            <div class="about-container">
                <div class="about-sidebar">
                    <div class="skill-box">
                        <div class="skill-header">Social Links</div>
                        <div class="skill-list">
                            <div style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:3px 0;" onclick="openWindow('instagram')">
                                <img src="${APPS.instagram.icon}" style="width:16px;height:16px;" onerror="this.style.display='none'"> Instagram
                            </div>
                            <div style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:3px 0;" onclick="openWindow('github')">
                                <img src="${APPS.github.icon}" style="width:16px;height:16px;" onerror="this.style.display='none'"> GitHub
                            </div>
                            <div style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:3px 0;" onclick="openWindow('linkedin')">
                                <img src="${APPS.linkedin.icon}" style="width:16px;height:16px;" onerror="this.style.display='none'"> LinkedIn
                            </div>
                        </div>
                    </div>

                    <div class="skill-box">
                        <div class="skill-header">Skills</div>
                        <div class="skill-list">
                            Canva Designer <br>AI/ML<br>Web Designer (Intermediate) <br>PPT Designer<br> Photgraphy <br> 
                        </div>
                    </div>

                    <div class="skill-box">
                        <div class="skill-header">Software</div>
                        <div class="skill-list">
                            Canva<br>VS Code<br>GColab<br>Base44<br>Adobe Lightroom<br>           
                        </div>
                    </div>
                </div>
                <div class="about-main">
                    <h2>HELLO</h2>
                    
                    <h6>
                    <p>
                         I’m Vismay Rao B. N., Lead Instructor in GyaanKool Research Labs, Computer Science and Electronics graduate with a strong interest in AI, 
                    machine learning, and practical software development. 
                    I enjoy building real-world projects that combine technology, creativity, and problem-solving —
                     especially in areas like assistive systems, IoT, and intelligent applications.
                     
                     </p>

                    <p>
                    I’ve worked on projects involving computer vision, LLMs with RAG architectures, embedded systems, 
                    and award-winning innovations such as a Smart Bandage System and Accident Prevention Glasses.
                     Alongside development, I have a keen eye for design and presentation,
                     which helps me create clean, user-friendly interfaces. 
                     
                     </p>

                     <p>
                     I’m continuously learning teaching and also aiming to build technology that is useful, reliable, and impactful. 
                        </p>
                     
                     </h6>
                </div>
            </div>`
        });
    } else if (app === 'contact') {
        title = 'Contact Me';
        contentHTML = `
            <div class="contact-form">
                <div class="toolbar">
                    <button class="btn-send" onclick="sendEmail()">Send</button>
                </div>
                <div class="form-row"><label>To:</label><input type="text" value="darkcelerium@gmail.com" readonly></div>
                <div class="form-row"><label>Subject:</label><input type="text" id="email-subject" placeholder="Enter subject..."></div>
                <textarea class="form-body" id="email-body" placeholder="Write your message here..."></textarea>
            </div>`;
    } else if (app === 'projects') {
        title = 'My Projects';
        const pgBodyId = 'pg-body-' + id;
        contentHTML = buildBrowserChrome({
            addressText: 'My Projects',
            toolbarLinks: [
                { icon: CHROME_ICONS.home, label: 'Home', onclick: `pgShowGrid('${pgBodyId}')` },
                { icon: CHROME_ICONS.favorites, label: 'Favorites', disabled: true, title: 'Not available in this demo' },
                { icon: CHROME_ICONS.theme, label: 'Light/Dark', onclick: `pgToggleTheme('${pgBodyId}')` }
            ],
            bodyId: pgBodyId,
            bodyHTML: pgRenderGrid(pgBodyId)
        });
    } else if (app === 'resume') {
        title = 'My Resume'; // Title for the window
        //Pdf Viewer HTML Content GEMINI PRO CODE // Contains options to Zoom, Save, Print, Contact Me
        contentHTML = ` 
            <div style="display: flex; flex-direction: column; height: 100%; background-color: #808080;"> <div style="background: #ece9d8; border-bottom: 1px solid #aaa; padding: 5px; display: flex; gap: 10px; align-items: center; font-size: 11px;">
                    <div style="margin-right: 10px; color: #000;">File&nbsp;&nbsp;View&nbsp;&nbsp;Help</div>
                    <div style="width: 1px; height: 16px; background: #aaa; margin: 0 5px;"></div> 
                    
                    <div style="display: flex; align-items: center; cursor: pointer; padding: 2px 5px; border: 1px solid transparent;">
                        <span style="margin-right: 4px; font-weight:bold; color: #555;">🔍</span> Zoom
                    </div>
                    <div style="width: 1px; height: 16px; background: #aaa; margin: 0 5px;"></div>
                    
                    <div style="display: flex; align-items: center; cursor: pointer; padding: 2px 5px; border: 1px solid transparent;" onclick="window.open('./assets/resume/resume.pdf', '_blank')">
                        <span style="margin-right: 4px; font-weight:bold; color: #0055EA;">💾</span> Save
                    </div>
                    
                    <div style="display: flex; align-items: center; cursor: pointer; padding: 2px 5px; border: 1px solid transparent;" onclick="document.getElementById('pdf-iframe-${id}').contentWindow.print()">
                         <span style="margin-right: 4px; font-weight:bold; color: #555;">🖨️</span> Print
                    </div>
                    <div style="width: 1px; height: 16px; background: #aaa; margin: 0 5px;"></div>

                    <div style="display: flex; align-items: center; cursor: pointer; padding: 2px 5px; border: 1px solid transparent;" onclick="openWindow('contact')">
                        <span style="margin-right: 4px; font-weight:bold; color: #0055EA;">📧</span> Contact Me
                    </div>
                </div>

                <div style="flex: 1; overflow: auto; padding: 20px; display: flex; justify-content: center; align-items: flex-start; background: #b0b0b0;">
                    <iframe id="pdf-iframe-${id}" src="./assets/resume/resume.pdf#toolbar=0&navpanes=0&scrollbar=0" style="width: 80%; height: 100%; min-height: 500px; border: 1px solid #000; background: #fff; box-shadow: 2px 2px 5px rgba(0,0,0,0.5);"></iframe>
                </div>
                
                <div style="background: #ece9d8; border-top: 1px solid #aaa; padding: 2px 5px; font-size: 11px; color: #333;">
                    Click to zoom, then drag to view other areas
                </div>
            </div>
        `;
    }

    /* --- NEW: WOLFENSTEIN in-canvas video renderer ---
       We add this block but do not change any of your existing logic.
       This sets contentHTML to include a hidden <video> and a visible <canvas>.
       The canvas draw loop will read frames from the video and draw them continuously.
    */
    else if (app === 'wolfenstein') {
        title = 'Fav Quote';
        contentHTML = `
            <div style="width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;position:relative;">
                <video id="wolf-video-${id}" src="./assets/media/wolf.mp4" preload="auto" playsinline muted style="display:none;"></video>
                <canvas id="wolf-canvas-${id}" style="width:100%;height:100%;background:#000;display:block;"></canvas>
                <div id="wolf-overlay-${id}" style="position:absolute;top:8px;left:8px;color:#fff;font-family:monospace;pointer-events:none;display:none;"></div>
            </div>
        `;
    }

    /* --- NEW: SNAKE game window (simple canvas) --- */
    else if (app === 'snake') {
        title = 'Snake';
        contentHTML = `
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;color:#0f0;">
                <canvas id="snake-canvas-${id}" width="400" height="320" style="border:2px solid #333;background:#111"></canvas>
                <div style="position:absolute;bottom:8px;left:8px;color:#ccc;font-size:12px">Use arrow keys</div>
            </div>
        `;
    }




    // Set window inner HTML for title bar and content
   win.innerHTML = `
  <div class="title-bar" onmousedown="dragWindow(event, '${id}')">
    <span>${title}</span>
    <div class="controls">
      <div onclick="minimizeWindow('${id}')" title="Minimize"><img src="${WINDOW_CONTROL_ICONS.minimize}" onerror="this.replaceWith('—')"></div>
      <div onclick="maximizeWindow('${id}')" title="Maximize"><img src="${WINDOW_CONTROL_ICONS.maximize}" onerror="this.replaceWith('▢')"></div>
      <div onclick="closeWindow('${id}')" title="Close"><img src="${WINDOW_CONTROL_ICONS.close}" onerror="this.replaceWith('X')"></div>
    </div>
  </div>
  <div class="window-content">${contentHTML}</div>
`;


    // Append window to area
    area.appendChild(win);
    addToTaskbar(id, title, app);


    /* --- Init additional behaviours for newly added apps (wolfenstein & snake) ---
       We do not remove or alter any of your existing app code; we only initialize
       runtime loops and handlers after the window has been appended to the DOM.
    */

    // --- Wolfenstein initialization (video -> drawImage(canvas) loop) ---
    if (app === 'wolfenstein') {
        (function initWolf() {
            const video = document.getElementById(`wolf-video-${id}`);
            const canvas = document.getElementById(`wolf-canvas-${id}`);
            const overlay = document.getElementById(`wolf-overlay-${id}`);
            if (!canvas || !video) {
                console.warn('[WOLF] required elements not found for', id);
                return;
            }
            const ctx = canvas.getContext('2d');
            let raf = null;
            let stopped = false;

            // Ensure crisp pixel sizing
            function resizeCanvasToDisplaySize() {
                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                const w = Math.round(rect.width * dpr);
                const h = Math.round(rect.height * dpr);
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w;
                    canvas.height = h;
                }
            }

            // Draw loop that draws the current video frame into canvas
            function drawLoop() {
                // Stop if window has been removed
                if (!document.getElementById(id)) {
                    stopped = true;
                    if (raf) cancelAnimationFrame(raf);
                    try { video.pause(); } catch (e) { }
                    return;
                }

                if (video.readyState >= 2 && !video.paused && !video.error) {
                    resizeCanvasToDisplaySize();
                    try {
                        // draw scaled to full canvas
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    } catch (e) {
                        console.warn('[WOLF] drawImage failed', e);
                    }
                }
                raf = requestAnimationFrame(drawLoop);
            }

            // Video settings: loop and muted to allow autoplay; we'll unmute on first user click
            video.loop = true;
            video.muted = true;
            video.playsInline = true;

            // Unmute on first click inside the window (counts as user gesture)
            const winElem = document.getElementById(id);
            if (winElem) {
                winElem.addEventListener('click', function _onceUnmute() {
                    try {
                        video.muted = false;
                        video.volume = 1.0;
                    } catch (e) { /* ignore */ }
                    winElem.removeEventListener('click', _onceUnmute);
                }, { once: true });
            }

            // Start playing when metadata is loaded
            video.addEventListener('loadeddata', () => {
                // If canvas is not visible because of CSS it will still draw; we manage size on draw
                video.play().catch((e) => {
                    // autoplay blocked, but the drawLoop will fallback to GIF if error
                    console.warn('[WOLF] autoplay prevented or blocked', e);
                });
                if (!raf) raf = requestAnimationFrame(drawLoop);
            });

            // Fallback: if error or not ready, show animated GIF instead of canvas
            video.addEventListener('error', (ev) => {
                console.warn('[WOLF] video error; falling back to GIF', ev);
                const gif = document.createElement('img');
                gif.src = './assets/images/wolf-main-screen.gif';
                gif.style.maxWidth = '100%';
                gif.style.maxHeight = '100%';
                gif.style.objectFit = 'contain';
                // replace canvas with gif
                try {
                    canvas.replaceWith(gif);
                } catch (e) { console.warn('[WOLF] replace failed', e); }
                if (raf) cancelAnimationFrame(raf); raf = null;
            });

            // Extra safety: if video doesn't become ready in time, try to play; if fails, trigger error
            setTimeout(() => {
                if (!video || video.readyState < 2) {
                    video.play().catch(() => {
                        // force fallback: trigger error event to show GIF
                        const ev = new Event('error');
                        video.dispatchEvent(ev);
                    });
                }
            }, 800);

            // Ensure loop persists (defensive)
            video.addEventListener('ended', () => {
                try {
                    video.currentTime = 0;
                    video.play().catch(() => { /* ignore */ });
                } catch (e) { /* ignore */ }
            });

            // When the window is removed (closeWindow), the element will be gone and drawLoop stops
        })();
    }

    // --- Snake initialization ---
    if (app === 'snake') {
        (function initSnake() {
            const canvas = document.getElementById(`snake-canvas-${id}`);
            if (!canvas) {
                console.warn('[SNAKE] canvas not found for', id);
                return;
            }
            const ctx = canvas.getContext('2d');

            // Basic snake game variables
            const TILE = 16;
            const cols = Math.floor(canvas.width / TILE);
            const rows = Math.floor(canvas.height / TILE);
            let snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
            let dir = { x: 1, y: 0 };
            let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            let running = true;
            let speed = 120; // ms per step

            function draw() {
                // Stop if window removed
                if (!document.getElementById(id)) {
                    running = false;
                    return;
                }
                // background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // food
                ctx.fillStyle = '#d33';
                ctx.fillRect(food.x * TILE, food.y * TILE, TILE, TILE);

                // snake
                ctx.fillStyle = '#0f0';
                snake.forEach(seg => ctx.fillRect(seg.x * TILE, seg.y * TILE, TILE - 1, TILE - 1));
            }

            function step() {
                if (!running) return;
                const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

                // wall collision (wrap-around could be used instead)
                if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
                    running = false;
                    return;
                }

                // self collision
                for (let i = 0; i < snake.length; i++) {
                    if (snake[i].x === head.x && snake[i].y === head.y) {
                        running = false;
                        return;
                    }
                }

                snake.unshift(head);

                // eat food
                if (head.x === food.x && head.y === food.y) {
                    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
                } else {
                    snake.pop();
                }

                draw();
            }

            // keyboard
            function onKey(e) {
                if (e.key === 'ArrowUp' && dir.y === 0) dir = { x: 0, y: -1 };
                if (e.key === 'ArrowDown' && dir.y === 0) dir = { x: 0, y: 1 };
                if (e.key === 'ArrowLeft' && dir.x === 0) dir = { x: -1, y: 0 };
                if (e.key === 'ArrowRight' && dir.x === 0) dir = { x: 1, y: 0 };
            }
            window.addEventListener('keydown', onKey);

            const loop = setInterval(() => {
                if (!document.getElementById(id)) {
                    // window closed -> cleanup
                    clearInterval(loop);
                    window.removeEventListener('keydown', onKey);
                    return;
                }
                step();
            }, speed);

            // initial draw
            draw();
        })();
    }
}

// Builds the HTML for an 'iframe' type app: a mini browser toolbar
// (address bar + refresh + open-in-new-tab) with the URL loaded below it.
// Used automatically for every APPS entry with type: 'iframe'.
function buildIframeWindow(id, url, title) {
    return `
        <div style="display:flex; flex-direction:column; height:100%; background:#ece9d8;">
            <div style="display:flex; align-items:center; gap:6px; padding:5px; border-bottom:1px solid #aaa; background:#ece9d8;">
                <button onclick="reloadAppFrame('${id}')" title="Refresh" style="border:1px solid #7f9db9; background:#f0f0f0; cursor:pointer; padding:2px 8px; font-size:12px;">&#8635;</button>
                <input type="text" value="${url}" readonly style="flex:1; padding:3px 6px; border:1px solid #7f9db9; font-size:11px; background:#fff; color:#333;">
                <button onclick="window.open('${url}', '_blank')" title="Open in new tab" style="border:1px solid #7f9db9; background:#f0f0f0; cursor:pointer; padding:2px 8px; font-size:11px; white-space:nowrap;">&#8599; Open</button>
            </div>
            <div style="flex:1; position:relative; background:#fff;">
                <iframe id="app-frame-${id}" src="${url}" style="width:100%; height:100%; border:none;"></iframe>
            </div>
            <div style="background:#ece9d8; border-top:1px solid #aaa; padding:3px 6px; font-size:10px; color:#555;">
                Some sites block being shown inside a window &mdash; use &#8599; Open above if this looks empty.
            </div>
        </div>`;
}

// Reloads an iframe-app's frame in place (the toolbar's refresh button)
function reloadAppFrame(id) {
    const frame = document.getElementById('app-frame-' + id);
    if (frame) frame.src = frame.src;
}

// Builds a shared IE-style chrome (menu bar, toolbar, address bar, status
// bar) around any window's content. Used by About Me and My Projects so
// they read like pages inside a mini browser, matching the reference design.
//
// options:
//   addressText   - text shown in the address bar (e.g. "About Me")
//   toolbarLinks  - [{ icon, label, onclick }] extra buttons after Back/Forward
//   bodyHTML      - the actual window content
//   bodyId        - optional id put on the scrolling body div (for later updates)
//   statusText    - status bar text, defaults to "Ready"
function buildBrowserChrome({ addressText, toolbarLinks = [], bodyHTML, bodyId = '', statusText = 'Ready' }) {
    const extraButtons = toolbarLinks.map(link => `
        <div class="browser-toolbar-btn${link.disabled ? ' disabled' : ''}"
             ${link.disabled ? `title="${link.title || 'Not available in this demo'}"` : `onclick="${link.onclick}"`}>
            <img src="${link.icon}" onerror="this.style.display='none'">
            <span>${link.label}</span>
        </div>`).join('');

    return `
        <div class="browser-chrome">
            <div class="browser-menubar"><span>File</span><span>View</span><span>Help</span></div>
            <div class="browser-toolbar">
                <div class="browser-toolbar-btn" title="Go to home/main view" onclick="goBackInWindow('${bodyId}')">
                    <img src="${CHROME_ICONS.back}" onerror="this.style.display='none'">
                    <span>Back</span>
                </div>
                <div class="browser-toolbar-btn" title="Go to home/main view" onclick="goForwardInWindow('${bodyId}')">
                    <img src="${CHROME_ICONS.forward}" onerror="this.style.display='none'">
                    <span>Forward</span>
                </div>
                <div class="browser-toolbar-sep"></div>
                ${extraButtons}
            </div>
            <div class="browser-address-row">
                <span>Address</span>
                <img src="${CHROME_ICONS.ie}" onerror="this.style.display='none'">
                <div class="browser-address-bar">${addressText}</div>
                <button class="browser-go-btn">Go</button>
            </div>
            <div class="browser-body"${bodyId ? ` id="${bodyId}"` : ''}>${bodyHTML}</div>
            <div class="browser-statusbar">${statusText}</div>
        </div>`;
}

// --- MY PROJECTS gallery: grid + detail views, driven by the PROJECTS array ---

// Renders the thumbnail grid (the gallery's "home" view)
function pgRenderGrid(bodyId) {
    const social = `
        <div class="pg-social">
            <img src="${APPS.linkedin.icon}" title="LinkedIn" onclick="openWindow('linkedin')" onerror="this.style.display='none'">
            <img src="${APPS.instagram.icon}" title="Instagram" onclick="openWindow('instagram')" onerror="this.style.display='none'">
            <img src="${APPS.github.icon}" title="GitHub" onclick="openWindow('github')" onerror="this.style.display='none'">
        </div>`;

    const cards = PROJECTS.map((p, i) => `
        <div class="pg-card" onclick="pgShowDetail('${bodyId}', ${i})">
            <div class="pg-thumb">
                <img src="${p.image}" onerror="this.style.display='none'">
            </div>
            <div class="pg-card-body">
                <div class="pg-card-title">${p.title}</div>
                <div class="pg-card-brief">${p.brief || ''}</div>
            </div>
        </div>`).join('');

    return `${social}<div class="pg-grid">${cards}</div>`;
}

// Renders a single project's detail page
function pgRenderDetail(bodyId, index) {
    const p = PROJECTS[index];
    if (!p) return '';
    return `
        <div class="pg-detail">
            <div class="pg-detail-thumb">
                <img src="${p.image}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" onerror="this.style.display='none'">
            </div>
            <h2>${p.title}</h2>
            <div class="pg-detail-desc">${p.description || ''}</div>
            <div class="pg-detail-actions">
                <button class="pg-btn primary" onclick="window.open('${p.url}', '_blank')">View on GitHub &#8599;</button>
                <button class="pg-btn" onclick="pgShowGrid('${bodyId}')">&larr; Back to Projects</button>
            </div>
        </div>`;
}

// Swaps a Projects window's body back to the grid view
function pgShowGrid(bodyId) {
    const body = document.getElementById(bodyId);
    if (body) body.innerHTML = pgRenderGrid(bodyId);
}

// Swaps a Projects window's body to a project's detail view
function pgShowDetail(bodyId, index) {
    const body = document.getElementById(bodyId);
    if (body) body.innerHTML = pgRenderDetail(bodyId, index);
}

// Navigation functions for Back/Forward buttons
function goBackInWindow(bodyId) {
    if (bodyId) {
        // If in a projects/about window, go back to grid/main view
        pgShowGrid(bodyId);
    }
}

function goForwardInWindow(bodyId) {
    if (bodyId) {
        // Forward goes to home/grid view as well
        pgShowGrid(bodyId);
    }
}

// Toggles the dark theme on a Projects window (the toolbar's Light/Dark button)
function pgToggleTheme(bodyId) {
    const body = document.getElementById(bodyId);
    if (body) body.classList.toggle('pg-dark');
}

// Close window and remove from taskbar
function closeWindow(id) {
    document.getElementById(id).remove();
    document.getElementById('task-' + id).remove();
}
// Add window to taskbar that is opened
function addToTaskbar(winId, title, app) {
    const bar = document.getElementById('taskbar-apps');
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab active';
    tab.id = 'task-' + winId;

    // Choose icon based on app in the taskbar while opened — pulled straight
    // from the APPS registry, so new apps get a taskbar icon for free.
    const iconSrc = (APPS[app] && APPS[app].icon) || './assets/images/ie.png';

    tab.innerHTML = `<img src="${iconSrc}"> ${title}`;
   tab.onclick = () => {
  const win = document.getElementById(winId);
  if (!win) return;

  if (win.dataset.minimized === 'true') {
    // Restore minimized window
    win.style.display = 'flex';
    win.dataset.minimized = 'false';
  }

  // Bring to front
  zIndex++;
  win.style.zIndex = zIndex;
};

    bar.appendChild(tab);
}
// Dragging logic for windows
function dragWindow(e, id) {
    const win = document.getElementById(id);
    zIndex++;
    win.style.zIndex = zIndex;

    let shiftX = e.clientX - win.getBoundingClientRect().left;
    let shiftY = e.clientY - win.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        win.style.left = pageX - shiftX + 'px';
        win.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
    };
}

// EMAIL LOGIC 
function sendEmail() {
    const subject = document.getElementById('email-subject').value;
    const body = document.getElementById('email-body').value;
    window.location.href = `mailto:darkcelerium@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  win.style.display = 'none';
  win.dataset.minimized = 'true';
}


function maximizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  if (win.dataset.maximized === 'true') {
    // restore
    win.style.left = win.dataset.left;
    win.style.top = win.dataset.top;
    win.style.width = win.dataset.width;
    win.style.height = win.dataset.height;
    win.dataset.maximized = 'false';
  } else {
    // save current state
    win.dataset.left = win.style.left;
    win.dataset.top = win.style.top;
    win.dataset.width = win.style.width;
    win.dataset.height = win.style.height;

    // maximize
    win.style.left = '0';
    win.style.top = '0';
    win.style.width = '100%';
    win.style.height = 'calc(100% - 40px)';
    win.dataset.maximized = 'true';
  }

  zIndex++;
  win.style.zIndex = zIndex;
}



/* ===============================
   EXTERNAL GAME LAUNCHER (dos.zone)
   =============================== */

function launchExternalGame(name, url) {
  showXpConfirm(
    `The game "${name}" will open in your browser.`,
    () => window.open(url, '_blank')
  );
}

function showXpConfirm(message, onConfirm) {
  const dialog = document.createElement('div');
  dialog.className = 'xp-confirm-overlay';
  dialog.innerHTML = `
    <div class="xp-confirm-box">
      <div class="xp-confirm-title">Windows XP</div>
      <div class="xp-confirm-body">
        <p>${message}</p>
      </div>
      <div class="xp-confirm-actions">
        <button id="xp-ok">Open</button>
        <button id="xp-cancel">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById('xp-ok').onclick = () => {
    dialog.remove();
    onConfirm();
  };

  document.getElementById('xp-cancel').onclick = () => {
    dialog.remove();
  };
}
