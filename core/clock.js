/**
 * clock.js — small clock widget initializer
 * Call `initClock()` to start the live clock in the taskbar.
 */
export function initClock() {
    const clockEl = document.getElementById('clock-time');
    
    // Update the clock display with 12-hour formatting and AM/PM
    function update() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minStr = minutes < 10 ? '0' + minutes : minutes;
        
        clockEl.textContent = `${hours}:${minStr} ${ampm}`;
    }

    setInterval(update, 1000);
    update();
}