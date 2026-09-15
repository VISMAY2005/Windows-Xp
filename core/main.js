
/*<!--
  main.js (HTML) — the app shell for the demo OS
  - contains boot/login/desktop markup and links to core scripts
  - edit UI in ./ui/ */


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vismay XP - Portfolio OS</title>
    
    <link rel="stylesheet" href="./ui/boot.css">
    <link rel="stylesheet" href="./ui/login.css">
    <link rel="stylesheet" href="./ui/desktop.css">
    
    <link rel="icon" href="./assets/images/xp-logo.png">
</head>
<body>

    <!-- Boot screen: branding shown while app 'boots' -->
    <div id="boot-screen" class="screen">
        <div class="boot-content">
            <div class="xp-logo-large">
                <span class="win-logo"></span>
                <span class="brand-text">Microsoft</span>
                <span class="os-text">Windows <span class="xp-orange">XP</span></span>
            </div>
            <div class="boot-loader">
                <div class="loader-bar">
                    <div class="block"></div><div class="block"></div><div class="block"></div>
                </div>
            </div>
            <div class="branding-text">Portfolio<br>Vismay XP</div>
            <div class="copyright">© Portfolio</div>
        </div>
    </div>

    <!-- Login screen: choose user to sign in -->
    <div id="login-screen" class="screen hidden">
        <div class="login-container">
            <div class="login-left">
                <div class="xp-logo-medium">Windows <span class="xp-orange">XP</span></div>
                <div class="login-instruction">To begin, click your user name</div>
            </div>
            <div class="login-divider"></div>
            <div class="login-right">
                <div class="user-card" id="user-login-btn">
                    <div class="user-avatar">
                        <img src="./assets/images/avatar.png" alt="User" onerror="this.style.display='none'">
                        <div class="avatar-fallback"></div> 
                    </div>
                    <div class="user-info">
                        <div class="username">Vismay</div>
                        <div class="subtitle">Administrator</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-footer">
            <div class="footer-btn" id="login-shutdown-btn">
                <div class="icon-shutdown"></div> Turn Off Computer
            </div>
        </div>
    </div>

    <!-- Welcome card: brief greeting shown after login -->
    <div id="welcome-screen" class="screen hidden">
        <div class="welcome-text">Welcome</div>
    </div>

    <!-- Desktop area: icons, windows, and start menu live here -->
    <div id="desktop-screen" class="screen hidden">
        
        <div id="desktop-icons" class="desktop-icons">
            </div>

        <div id="window-area">
            </div>

        <!-- Start menu: app links and small utilities -->
        <div id="start-menu" class="hidden">
            <div class="start-header">
                <img src="./assets/images/avatar.png" class="start-avatar" onerror="this.style.display='none'">
                <span class="start-username">Vismay</span>
            </div>
            <div class="start-body">
                <div class="start-col-left">
                    <div class="start-item" data-app="browser">
                        <img src="./assets/images/ie.png" class="icon" onerror="this.style.display='none'"> 
                        <div class="label"><strong>Internet</strong><br><span class="sub">Browser</span></div>
                    </div>
                    <div class="start-item" data-app="email">
                        <img src="./assets/images/email.png" class="icon" onerror="this.style.display='none'">
                        <div class="label"><strong>E-mail</strong><br><span class="sub">Outlook Express</span></div>
                    </div>
                    <div class="separator"></div>

                    <div class="start-item" data-app="projects">
                        <img src="./assets/images/projects.png" class="icon" onerror="this.style.display='none'">
                        <span class="label">My Projects</span>
                    </div>
                    <div class="start-item" data-app="about">
                        <img src="./assets/images/about.png" class="icon" onerror="this.style.display='none'">
                        <span class="label">About Me</span>
                    </div>
                </div>
                <div class="start-col-right">
                    <div class="start-item-sm">My Documents</div>
                    <div class="start-item-sm">My Pictures</div>
                    <div class="start-item-sm">My Music</div>
                    <div class="separator"></div>
                    <div class="start-item-sm">My Computer</div>
                    <div class="separator"></div>
                    <div class="start-item-sm external-link" data-url="https://github.com">GitHub</div>
                    <div class="start-item-sm external-link" data-url="https://linkedin.com">LinkedIn</div>
                    <div class="start-item-sm external-link" data-url="https://instagram.com">Instagram</div>
                </div>
            </div>
            <div class="start-footer">
                <div class="footer-action" id="start-shutdown">
                    <div class="icon-shutdown-sm"></div> Turn Off Computer
                </div>
                <div class="footer-action" id="start-restart">
                    <div class="icon-restart-sm"></div> Restart
                </div>
            </div>
            
            <div class="search-area">
                <input type="text" id="start-search" placeholder="Search...">
            </div>
        </div>

        <div id="taskbar">
            <button id="start-btn">
                <span class="win-logo-sm"> </span> start
            </button>
            <div id="taskbar-apps">
                </div>
            <div id="system-tray">
                <div class="tray-icon network"></div>
                <div class="tray-icon volume"></div>
                <div class="time-display">
                    <span id="clock-time">12:00 PM</span>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="./core/boot.js"></script>
</body>
</html>