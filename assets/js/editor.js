document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. THEME TOGGLE LOGIC (Dark/Light Mode)
    // ==========================================
    const themeBtn = document.getElementById('themeToggle');
    const body = document.body;

    // Check Memory on Load
    if (localStorage.getItem('pulse_theme') === 'light') {
        body.setAttribute('data-theme', 'light');
        if(themeBtn) themeBtn.innerText = "☀️"; 
    } else {
        if(themeBtn) themeBtn.innerText = "🌙"; 
    }

    // Toggle Click Event
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'light') {
                // Switch to Dark
                body.removeAttribute('data-theme');
                themeBtn.innerText = "🌙";
                localStorage.setItem('pulse_theme', 'dark');
            } else {
                // Switch to Light
                body.setAttribute('data-theme', 'light');
                themeBtn.innerText = "☀️";
                localStorage.setItem('pulse_theme', 'light');
            }
        });
    }

    // ==========================================
    // 2. VIDEO PLAYER & VARIABLES
    // ==========================================
    const video = document.getElementById('mainVideo');
    const playBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeText = document.getElementById('currentTime');
    const totalTimeText = document.getElementById('totalTime');
    
    // Tool UI Elements
    const toolPanelArea = document.getElementById('toolPanelArea');
    const toolButtons = document.querySelectorAll('.tool-item');
    const panelContents = document.querySelectorAll('.panel-content');

    // Filter State
    let currentFilter = 'none';
    let currentBrightness = 100;
    let currentContrast = 100;

    // Trim State
    let trimStart = 0;
    let trimEnd = 0;

    // Helper: Format Seconds to 00:00
    function formatTime(s) {
        let m = Math.floor(s / 60);
        let sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0'+sec : sec}`;
    }

    // Initialize Video Data
    video.addEventListener('loadedmetadata', () => {
        totalTimeText.innerText = formatTime(video.duration);
        trimEnd = video.duration; // Default trim end is video end
    });

    // Play/Pause Logic
    function togglePlay() {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = "||";
        } else {
            video.pause();
            playBtn.innerHTML = "▶";
        }
    }
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // ==========================================
    // 3. TOOLBAR SIDEBAR LOGIC
    // ==========================================
    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const toolName = btn.dataset.tool;
            
            // Highlight Icon
            toolButtons.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            // Open Side Panel
            toolPanelArea.classList.add('open');

            // Show Specific Content
            panelContents.forEach(panel => panel.classList.remove('active'));
            const targetPanel = document.getElementById(`panel-${toolName}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ==========================================
    // 4. FILTER & ADJUSTMENT LOGIC
    // ==========================================
    // Attach these to window so HTML onclick="..." can see them
    window.applyFilter = function(filterValue) {
        currentFilter = filterValue;
        renderVideoStyles();
    }

    window.updateSettings = function(slider, type) {
        if (type === 'brightness') currentBrightness = slider.value;
        if (type === 'contrast') currentContrast = slider.value;
        renderVideoStyles();
    }

    function renderVideoStyles() {
        let styleString = `brightness(${currentBrightness}%) contrast(${currentContrast}%)`;
        if (currentFilter !== 'none') {
            styleString += ` ${currentFilter}`;
        }
        video.style.filter = styleString;
    }

    // ==========================================
    // 5. TIMELINE & TRIM LOGIC (The Hard Part)
    // ==========================================
    const track = document.getElementById('timelineTrack');
    const handleL = document.getElementById('handleL');
    const handleR = document.getElementById('handleR');
    const activeZone = document.getElementById('activeZone');

    let isDraggingL = false;
    let isDraggingR = false;

    // A. Update Progress Bar & Time Text
    video.addEventListener('timeupdate', () => {
        currentTimeText.innerText = formatTime(video.currentTime);
        
        // Progress Bar Width
        const pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${pct}%`;

        // ENFORCE TRIM LOOP
        // If video passes the Right Handle, go back to Left Handle
        if (trimEnd > 0 && video.currentTime >= trimEnd) {
            video.currentTime = trimStart;
            if(!video.paused) video.play();
        }
        // If user manually seeks before Left Handle
        if (video.currentTime < trimStart) {
            video.currentTime = trimStart;
        }
    });

    // B. Handle Dragging Interaction
    if (track && handleL && handleR) {
        track.addEventListener('mousedown', (e) => {
            if (e.target === handleL) isDraggingL = true;
            if (e.target === handleR) isDraggingR = true;
        });

        document.addEventListener('mouseup', () => {
            isDraggingL = false;
            isDraggingR = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingL && !isDraggingR) return;

            const rect = track.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            
            // Calculate Percent (0-100)
            let percent = (offsetX / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent)); 

            // Left Handle Logic
            if (isDraggingL) {
                let currentRight = parseFloat(handleR.style.right) || 0; 
                // Ensure handles don't cross (keep 5% gap)
                if (percent < (100 - currentRight - 5)) {
                    handleL.style.left = percent + '%';
                    activeZone.style.left = percent + '%';
                    
                    // Update Time Variable
                    trimStart = (percent / 100) * video.duration;
                    video.currentTime = trimStart; // Jump to start
                }
            }

            // Right Handle Logic
            if (isDraggingR) {
                let rightPercent = 100 - percent;
                let currentLeft = parseFloat(handleL.style.left) || 0;
                
                if (rightPercent < (100 - currentLeft - 5)) {
                    handleR.style.right = rightPercent + '%';
                    activeZone.style.right = rightPercent + '%';
                    
                    // Update Time Variable
                    trimEnd = (percent / 100) * video.duration;
                }
            }
        });
    }

});