// core/windowManager.js
// Small window manager for the demo OS. Simple and readable:
// - create windows, add taskbar buttons, support minimize/maximize/close
// - initialize small apps (wolfenstein video, snake canvas) and return cleanup handlers.
// - Video-first Wolfenstein, fallback to GIF <img> (no canvas drawing loops)
// - Calls initSnakeGame(windowId, state) for Snake windows
// - Returns cleanup functions to avoid leaks

import { state, apps } from './state.js';
import { initSnakeGame } from './snake.js';

const container = document.getElementById('window-area');
const taskbar = document.getElementById('taskbar-apps');

// Short unique id generator used for window element ids.
// Keeps ids short and mostly readable (e.g., win-abc1234)
const uid = (pref='win') => `${pref}-${Math.random().toString(36).slice(2,9)}`;

// Create the title bar element (left: title, right: min/max/close controls)
function makeTitleBar(title) {
  const bar = document.createElement('div');
  bar.className = 'xp-titlebar';
  bar.innerHTML = `
    <div class="xp-title-left"><span class="xp-title-text">${title}</span></div>
    <div class="xp-title-right">
      <button class="xp-btn-minimize" title="Minimize">—</button>
      <button class="xp-btn-maximize" title="Maximize">▢</button>
      <button class="xp-btn-close" title="Close">✕</button>
    </div>
  `;
  return bar;
}

// Add a button to the taskbar for the window and toggle minimize/restore on click
function addTaskbarButton(id, title, icon) {
  if (!taskbar) return null;
  const btn = document.createElement('button');
  btn.className = 'taskbar-app-button';
  btn.id = `task-${id}`;
  btn.innerHTML = `${icon ? `<img src="${icon}" width="16" height="16" alt="">` : ''}<span>${title}</span>`;
  btn.addEventListener('click', () => {
    const win = document.getElementById(id);
    if (!win) return;
    // If hidden -> restore
    if (win.style.display === 'none') {
      win.style.display = 'flex';
      win.style.zIndex = 9999;
    } else {
      // toggle minimize state
      const isHidden = win.getAttribute('data-minimized') === 'true';
      if (isHidden) {
        // the window was minimized, restore it
        win.style.display = 'flex';
        win.setAttribute('data-minimized', 'false');
      } else {
        // minimize the window
        win.style.display = 'none';
        win.setAttribute('data-minimized', 'true');
      }
    }
  });
  taskbar.appendChild(btn);
  return btn;
}

// Make the title bar draggable. Clicking control buttons should not start a drag.
function enableDrag(winEl, headerEl) {
  headerEl.style.cursor = 'move';
  headerEl.addEventListener('mousedown', (ev) => {
    // if user clicked a control (button), don't start dragging
    if (ev.target.closest('button')) return;
    const startRect = winEl.getBoundingClientRect();
    const startX = ev.clientX;
    const startY = ev.clientY;
    function onMove(e) {
      winEl.style.left = (startRect.left + e.clientX - startX) + 'px';
      winEl.style.top = (startRect.top + e.clientY - startY) + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

/**
 * Create and open a window for given appId (must exist in apps)
 * returns window id
 */
// Create and open a window for an appId.
// Sets initial size/position, adds title bar and content container, and appends to DOM.
// Returns the window id when successful.
export function openWindow(appId) {
  const app = apps[appId];
  if (!app) {
    console.error('[WM] app not found:', appId);
    return;
  }

  const id = uid(appId);
  const win = document.createElement('div');
  win.className = 'xp-window';
  win.dataset.state = 'normal';     // normal | minimized | maximized
  win._restore = null;              // used for maximize restore

  win.id = id;
  // position window roughly centered, with minimum offsets
  win.style.position = 'absolute';
  win.style.left = `${Math.max(8, (window.innerWidth - app.width) / 2)}px`;
  win.style.top = `${Math.max(48, (window.innerHeight - app.height) / 2)}px`;
  win.style.width = `${app.width}px`;
  win.style.height = `${app.height}px`;
  win.style.display = 'flex';
  win.style.flexDirection = 'column';
  win.setAttribute('data-app', appId);

  const titleBar = makeTitleBar(app.title || appId);
  const content = document.createElement('div');
  content.className = 'xp-window-content';
  content.style.flex = '1';
  content.style.overflow = 'hidden';
  content.style.background = app.background || 'transparent';

  // attach title and content, then add to the window area
  win.appendChild(titleBar);
  win.appendChild(content);
  (container || document.body).appendChild(win);
 
  // maximize behavior

  // taskbar button
  const taskBtn = addTaskbarButton(id, app.title || appId, app.icon);

  // wire close/minimize
  const btnClose = titleBar.querySelector('.xp-btn-close');
  const btnMin = titleBar.querySelector('.xp-btn-minimize');

  let cleanup = null;

  btnClose.addEventListener('click', () => {
    if (typeof cleanup === 'function') try { cleanup(); } catch(e){ console.warn('[WM] cleanup err', e); }
    closeWindow(id);
  });

  btnMin.addEventListener('click', () => {
    win.style.display = 'none';
    win.setAttribute('data-minimized', 'true');
  });

  enableDrag(win, titleBar);

  // init app content
  try {
    cleanup = initAppContent(appId, id, content, app);
  } catch (e) {
    console.error('[WM] initAppContent error', e);
    content.innerHTML = `<div style="padding:12px;color:#900">Error initializing ${appId}</div>`;
  }

  // focus on create
  win.style.zIndex = 9000;

  // store meta
  window._WM_windows = window._WM_windows || {};
  window._WM_windows[id] = { el: win, taskBtn, cleanup };

  return id;
}

// Close a window, call its cleanup handler if it exists, and remove taskbar button
export function closeWindow(id) {
  const meta = window._WM_windows && window._WM_windows[id];
  if (meta && meta.cleanup) {
    try { meta.cleanup(); } catch (e) { console.warn('[WM] cleanup failed', e); }
  }
  const el = document.getElementById(id);
  if (el) el.remove();
  const t = document.getElementById(`task-${id}`);
  if (t) t.remove();
  if (window._WM_windows) delete window._WM_windows[id];
}

// Populate the window content for known app ids.
// Each branch returns null or a cleanup function. Keep branches small and declarative.
function initAppContent(appId, windowId, containerEl, cfg) {
  // ABOUT: simple profile + links
  if (appId === 'about') {
    containerEl.innerHTML = `
      <div style="display:flex;height:100%;">
        <div style="width:240px;padding:12px;background:#f6fbff;border-right:1px solid #ddd;overflow:auto">
          <h4>Social</h4>
          <a href="#" id="about-github">GitHub</a><br>
          <a href="#" id="about-linkedin">LinkedIn</a>
          <h4 style="margin-top:12px">Skills</h4>
          <ul><li>Python • TensorFlow • OpenCV</li><li>ESP32 • Embedded</li></ul>
        </div>
        <div style="flex:1;padding:16px;overflow:auto">
          <h2>Vismay Rao B. N.</h2>
          <p>I’m a Computer Science & Electronics undergraduate focused on AI, embedded systems, and building real-world software with clean UI.</p>
        </div>
      </div>
    `;
    return null;
  }

  // PROJECTS: simple project tiles
  if (appId === 'projects') {
    containerEl.innerHTML = `
      <div style="padding:12px;height:100%;overflow:auto">
        <h2>My Projects</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
          <div style="background:#fff;padding:12px;border:1px solid #eee;">
            <strong>Wound Detection</strong><div>YOLOv3 + TF UI</div>
          </div>
          <div style="background:#fff;padding:12px;border:1px solid #eee;">
            <strong>Smart Bandage</strong><div>ESP32 dashboard + sensors</div>
          </div>
        </div>
      </div>
    `;
    return null;
  }

  // RESUME (iframe approach - identical to the working pattern you used)
  if (appId === 'resume') {
    containerEl.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;background:#eee">
        <div style="padding:8px;border-bottom:1px solid #ccc;background:#f3f3f3">
          <button onclick="window.open('assets/resume/resume.pdf','_blank')">Open PDF</button>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center">
          <iframe src="assets/resume/resume.pdf" style="width:92%;height:88%;border:1px solid #999"></iframe>
        </div>
      </div>
    `;
    return null;
  }

  // WOLFENSTEIN — video first, image fallback (no canvas) with robust loading and small custom controls
  if (appId === 'wolfenstein') {
    containerEl.innerHTML = `
      <div style="width:100%;
      height:100%;
      display:flex;
      flex-direction:column;
      background:#000;
      color:#fff">
        <div style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.06);
        display:flex;
        justify-content:space-between;
        align-items:center">
          <div><strong>Quote</strong></div>
        </div>
        <div style="flex:1;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:8px;
        position:relative">
          <div id="wolf-media-wrap-${windowId}" style="width:100%;height:100%;
          display:flex;align-items:center;
          justify-content:center;
          position:relative"></div>
        </div>
      </div>
    `;

    const wrap = containerEl.querySelector(`#wolf-media-wrap-${windowId}`);
    if (!wrap) {
      console.error('[wolf] wrap container missing');
      return null;
    }

    // On-screen status (helps users who don't open DevTools)
    let statusEl = wrap.querySelector('.wolf-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'wolf-status';
      statusEl.textContent = 'Wolf: initializing...';
      statusEl.style.position = 'absolute'; statusEl.style.left = '10px'; statusEl.style.top = '10px'; statusEl.style.zIndex = 30;
      wrap.appendChild(statusEl);
    }

    // Try multiple likely paths for the video file (covers differing folder names)
    const candidates = ['./assets/media/wolf.mp4','./assets/video/wolf.mp4','./assets/videos/wolf.mp4','./assets/images/wolf.mp4'];
    let attempt = 0;

    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = false; // wait until user or loadeddata to start playing
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = './assets/images/wolfenstein-icon.png';
    // force full size to avoid a tiny or 0x0 element
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.display = 'block';
    video.style.background = '#000';
    video.style.objectFit = 'contain';

    const controls = document.createElement('div');
    controls.className = 'wolf-controls';
    controls.innerHTML = `<button class="wolf-play">Play</button><button class="wolf-restart">Restart</button>`;

    // try candidates in order; if none work, we'll fall back to an animated GIF
    function setCandidate(i) {
      attempt = i;
      console.log('[wolf] trying candidate', candidates[i]);
      if (statusEl) statusEl.textContent = 'Trying: ' + candidates[i];
      video.src = candidates[i];
      video.load();
    }

    video.addEventListener('loadeddata', () => {
      console.log('[wolf] video loaded:', video.currentSrc);
      if (statusEl) statusEl.textContent = 'Loaded: ' + video.currentSrc;
      const img = wrap.querySelector('img'); if (img) img.remove();
      // ensure wrap has full height and black background so video is visible
      try { wrap.style.background = '#000'; wrap.style.width = '100%'; wrap.style.height = '100%'; } catch(e){}
      if (!wrap.contains(video)) wrap.appendChild(video);
      if (!wrap.contains(controls)) wrap.appendChild(controls);
      // log sizes to help debugging
      setTimeout(() => {
        console.log('[wolf] wrap rect', wrap.getBoundingClientRect());
        console.log('[wolf] video size', video.clientWidth, video.clientHeight, 'readyState', video.readyState);
      }, 80);
      // start playing (muted to allow autoplay in most browsers)
      video.play().catch(e => {
        console.warn('[wolf] autoplay prevented', e);
        if (statusEl) statusEl.textContent = 'Loaded but autoplay prevented — press Play';
      });
      updatePlayButton();
    });

    video.addEventListener('error', (e) => {
      console.warn('[wolf] video error on', candidates[attempt], e, 'code', video.error && video.error.code);
      if (statusEl) statusEl.textContent = 'Error loading: ' + candidates[attempt];
      // try next candidate
      if (attempt + 1 < candidates.length) {
        setCandidate(attempt + 1);
      } else {
        // all candidates failed — fallback to GIF or an error message
        if (video.parentElement) video.remove();
        startImageFallback();
      }
    });

    // set first candidate and append placeholder elements
    setCandidate(0);
    // append invisible video early so layout allocates space
    wrap.appendChild(video);

    // Setup controls behavior
    function updatePlayButton() {
      const btn = controls.querySelector('.wolf-play');
      if (!btn) return;
      btn.textContent = video.paused ? 'Play' : 'Pause';
    }
    controls.addEventListener('click', (ev) => {
      const t = ev.target;
      if (t.classList.contains('wolf-play')) {
        if (video.paused) video.play().catch(e => console.warn('[wolf] play failed', e));
        else video.pause();
        updatePlayButton();
      }
      if (t.classList.contains('wolf-restart')) {
        try { video.pause(); video.currentTime = 0; video.play().catch(()=>{}); updatePlayButton(); } catch(e) { console.warn('[wolf] restart failed', e); }
      }
    });

    // If element exists but has 0x0 size after a short time, try forcing sizing and show diagnostic text
    setTimeout(() => {
      try {
        const vw = video.clientWidth, vh = video.clientHeight;
        console.log('[wolf] post-append video size check', vw, vh);
        if ((vw === 0 && vh === 0) || (wrap.getBoundingClientRect().width === 0)) {
          console.warn('[wolf] video element has zero size — forcing full size and showing diagnostic');
          video.style.width = '100%'; video.style.height = '100%'; video.style.objectFit = 'contain';
          wrap.style.background = '#000';
          const diag = document.createElement('div');
          diag.style.position = 'absolute'; diag.style.left = '12px'; diag.style.top = '12px'; diag.style.color = '#fff'; diag.style.fontSize='12px'; diag.style.zIndex = 5;
          diag.textContent = 'Wolf: video element present but not rendering — check console for details';
          if (!wrap.querySelector('.wolf-diag')) { diag.className='wolf-diag'; wrap.appendChild(diag); }
        }
      } catch(e){/* ignore */}
    }, 350);

    // fallback: GIF <img>
    // If video is not usable, show a GIF fallback so the window still has content
    function startImageFallback() {
      if (wrap.querySelector('img')) return;
      if (statusEl) statusEl.textContent = 'Using GIF fallback';
      const gif = document.createElement('img');
      // Try common gif name; if missing, show message
      gif.src = './assets/images/wolf-main-screen.gif';
      gif.alt = 'Wolf fallback';
      gif.style.maxWidth = '100%'; gif.style.maxHeight = '100%'; gif.style.objectFit = 'contain';
      gif.addEventListener('load', (e) => {
        console.log('[wolf] gif loaded fallback');
        if (statusEl) statusEl.textContent = 'GIF fallback loaded';
        if (!wrap.contains(gif)) wrap.appendChild(gif);
      });
      gif.addEventListener('error', (ev) => {
        console.error('[wolf] gif failed to load', ev);
        if (statusEl) statusEl.textContent = 'No media found — see console';
        wrap.innerHTML = '<div style="color:#fff;padding:12px">Failed to load wolf media.<br>Ensure a file exists at one of: ./assets/media/wolf.mp4, ./assets/video/wolf.mp4, or ./assets/images/wolf.mp4</div>';
      });
      wrap.appendChild(gif);
    }

    // quick fallback trigger if metadata isn't ready
    setTimeout(() => {
      const ready = video && !video.error && video.readyState >= 2;
      if (!ready && !wrap.querySelector('img')) startImageFallback();
    }, 600);

    // cleanup returned and called when window closes
    return () => {
      try {
        if (video && !video.paused) video.pause();
        if (video && video.parentElement) video.remove();
        if (controls && controls.parentElement) controls.remove();
        const diag = wrap.querySelector('.wolf-diag'); if (diag) diag.remove();
      } catch (e) { /* ignore */ }
    };
  }

  // SNAKE — create canvas (if none) and call initSnakeGame(windowId, state)
  if (appId === 'snake') {
    containerEl.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;align-items:center;justify-content:center;background:#000;color:#0f0;">
        <canvas id="snakeCanvas-${windowId}" width="320" height="320" style="border:2px solid #333;background:#111;"></canvas>
        <div style="margin-top:10px;">Score: <span id="snakeScore-${windowId}">0</span></div>
      </div>
    `;

    // call initSnakeGame after a micro-delay to ensure DOM is present and measured
    setTimeout(() => {
      try {
        if (typeof initSnakeGame === 'function') initSnakeGame(windowId, state);
        else console.error('[WM] initSnakeGame not found');
      } catch (e) {
        console.error('[WM] initSnakeGame threw', e);
      }
    }, 80);

    // Return cleanup function (snake.js may place _snakeCleanup on canvas)
    return () => {
      const canvas = document.getElementById(`snakeCanvas-${windowId}`);
      try {
        if (canvas && typeof canvas._snakeCleanup === 'function') canvas._snakeCleanup();
      } catch (e) { console.warn('[WM] snake cleanup failed', e); }
    };
  }

  // default generic content
  containerEl.innerHTML = `<div style="padding:12px">No content for ${appId}</div>`;
  return null;
}

// expose for other modules / older code
window.openWindow = openWindow;
window.closeWindow = closeWindow;
export default { openWindow, closeWindow };
