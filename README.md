====================================================================
VISMAY XP – COMPLETE PROJECT GUIDE & MODIFICATION MANUAL
====================================================================

This document explains the ENTIRE Windows XP Portfolio OS project.

Purpose:
• To help any developer (even a beginner) understand
• To know where every feature lives
• To safely modify, extend, or customize the project
• To add new apps, games, icons, videos, sounds, or content

Read this once fully before making changes.

====================================================================
SECTION 1: CORE RULES (READ FIRST)
====================================================================

1. This project behaves like a mini operating system.
2. UI, logic, and assets are SEPARATED intentionally.
3. NEVER mix logic into CSS or HTML.
4. ALL behavior is controlled by JavaScript.
5. File paths are CASE-SENSITIVE.
6. Do NOT rename files unless you update references everywhere.
7. Browser autoplay rules apply to audio/video.

If something does not work:
→ Check console
→ Check file paths
→ Check app IDs passed to openWindow()

====================================================================
SECTION 2: PROJECT STRUCTURE (WHAT EXISTS & WHY)
====================================================================

/index.html
→ Main entry point
→ Desktop layout
→ Icons
→ Audio tags
→ Containers for windows & taskbar

/style.css
→ Visual styling ONLY
→ Windows XP theme
→ No logic allowed here

/script.js
→ OS controller
→ Boot screen
→ Login & welcome
→ Start menu
→ Global sounds
→ Window opening triggers

/core/
 ├─ windowManager.js
 │   → Window creation engine
 │   → App routing
 │   → Taskbar behavior
 │   → Games & media initialization
 │
 ├─ snake.js
 │   → Snake game logic
 │   → Canvas rendering
 │   → Keyboard controls
 │
 └─ state.js
     → Central app registry
     → Shared configuration
     → App metadata (title, size, icon)

 /assets/
 ├─ images/
 │   → Desktop icons
 │   → Taskbar icons
 │   → Wallpapers
 │   → GIF fallbacks
 │
 ├─ media/
 │   → Videos (wolf.mp4)
 │
 ├─ resume/
 │   → resume.pdf
 │
 └─ sounds/
     → startup.mp3
     → shutdown.mp3
     → click.mp3

====================================================================
SECTION 3: HOW FILES CONNECT TO EACH OTHER
====================================================================

index.html
  ↓ (loads)
style.css
  ↓
script.js
  ↓ (calls)
windowManager.js
  ↓ (loads)
snake.js + state.js
  ↓
assets folder (images, media, sounds, pdf)

IMPORTANT:
• index.html NEVER creates windows directly
• index.html only CALLS openWindow('appName')

====================================================================
SECTION 4: index.html (WHAT IT DOES & WHAT TO CHANGE)
====================================================================

index.html responsibilities:
• Desktop icons
• Taskbar layout
• Audio elements
• Structural divs

Desktop icons example:
ondblclick="openWindow('about')"

To ADD a new icon:
1. Copy an existing icon block
2. Change image source
3. Change openWindow('newApp')

To CHANGE icon image:
→ assets/images/

To CHANGE wallpaper:
→ assets/images/wallpaper.jpg

Audio tags:
<audio id="sound-startup" src="assets/sounds/startup.mp3">

To change sounds:
→ Replace MP3 files (keep same names)

====================================================================
SECTION 5: style.css (VISUALS ONLY)
====================================================================

Controls:
• XP colors
• Fonts
• Gradients
• Window borders
• Taskbar appearance

DO NOT:
• Add JavaScript
• Add logic
• Add timers

To change look:
• Window color
• Taskbar height
• Icon spacing

Modify CSS safely.

====================================================================
SECTION 6: script.js (OS CONTROLLER)
====================================================================

script.js controls SYSTEM behavior, not app content.

Key responsibilities:
• Boot screen timing
• Login transition
• Welcome screen
• Start menu toggle
• Global sounds
• Shutdown logic

Functions you may modify:
• playSound()
• loginUser()
• triggerShutdown()
• toggleStartMenu()

If boot loops infinitely:
→ script.js error
→ Check console

script.js DOES NOT define app layouts anymore.
That is handled by windowManager.js.

====================================================================
SECTION 7: windowManager.js (WINDOW + APP ENGINE)
====================================================================

windowManager.js is responsible for:
• Creating windows
• Dragging behavior
• Taskbar buttons
• Opening & closing apps
• Initializing games & media

IMPORTANT:
This file decides WHAT appears inside each window.

--------------------------------------------------------------------
7.1 APP REGISTRATION (state.js)
--------------------------------------------------------------------

Apps are defined in state.js like:

apps = {
  about: { title, width, height, icon },
  projects: { ... },
  resume: { ... },
  wolfenstein: { ... },
  snake: { ... }
}

To ADD a new app:
1. Add entry in state.js
2. Handle it in windowManager.js
3. Add icon in index.html

--------------------------------------------------------------------
7.2 APP CONTENT ROUTING
--------------------------------------------------------------------

Inside windowManager.js:

if (appId === 'about') { ... }
if (appId === 'projects') { ... }
if (appId === 'resume') { ... }
if (appId === 'wolfenstein') { ... }
if (appId === 'snake') { ... }

This is where UI HTML lives.

To MODIFY About Me:
→ Edit HTML inside about block

To MODIFY Projects:
→ Edit project cards HTML

To MODIFY Resume:
→ Replace resume.pdf only

--------------------------------------------------------------------
7.3 TASKBAR ICONS
--------------------------------------------------------------------

Taskbar icons are set using:
app.icon from state.js

Icons live in:
assets/images/

To change taskbar icon:
1. Replace image
2. Or update icon path in state.js

--------------------------------------------------------------------
7.4 WINDOW BEHAVIOR
--------------------------------------------------------------------

Each window supports:
• Dragging
• Minimize
• Close
• Focus (z-index)

Cleanup functions are returned when closing apps.
DO NOT remove cleanup logic (important for games).

====================================================================
SECTION 8: WOLFENSTEIN (VIDEO SYSTEM)
====================================================================

Uses:
• <video> element
• Loop enabled
• Muted initially (browser rule)
• User click can enable sound

Video file:
assets/media/wolf.mp4

Fallback:
assets/images/wolf-main-screen.gif

To change video:
→ Replace wolf.mp4

To enable sound:
→ Unmute video after user interaction

Video loops until window is closed.

====================================================================
SECTION 9: SNAKE GAME
====================================================================

snake.js controls:
• Game loop
• Canvas rendering
• Controls
• Cleanup

windowManager.js:
• Creates canvas
• Calls initSnakeGame(windowId, state)

To modify Snake:
• Speed
• Grid size
• Colors
• Scoring

Edit snake.js only.

====================================================================
SECTION 10: ASSETS FOLDER (VERY IMPORTANT)
====================================================================

assets/images/
→ Icons
→ Wallpapers
→ GIFs

assets/media/
→ Videos

assets/sounds/
→ Audio

assets/resume/
→ PDF resume

Rule:
DO NOT change filenames unless you update JS references.

====================================================================
SECTION 11: ADDING A NEW GAME / APP (STEP BY STEP)
====================================================================

1. Add icon image to assets/images/
2. Add desktop icon in index.html
3. Register app in state.js
4. Add app handler in windowManager.js
5. (Optional) Add game logic file
6. Ensure cleanup function exists

====================================================================
SECTION 12: COMMON ERRORS & FIXES
====================================================================

Blank window:
→ App not handled in windowManager.js

Icon opens nothing:
→ Wrong openWindow('id')

No sound:
→ Browser autoplay restriction

Video not playing:
→ Path issue or muted rule

Taskbar icon missing:
→ icon path wrong in state.js

====================================================================
FINAL NOTE
====================================================================

This project is structured like a REAL OS:
• script.js = system kernel
• windowManager.js = window compositor
• state.js = app registry
• assets = file system

If you understand these four,
you can modify ANYTHING confidently.

====================================================================
END OF DOCUMENT
====================================================================
