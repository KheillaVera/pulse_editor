document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Get Elements
    const video = document.getElementById('mainVideo');
    const playBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeText = document.getElementById('currentTime');
    const totalTimeText = document.getElementById('totalTime');

    // 2. Format Time Helper (Convert seconds to 00:00)
    function formatTime(seconds) {
        let m = Math.floor(seconds / 60);
        let s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0'+s : s}`;
    }

    // 3. Initialize Video Data
    video.addEventListener('loadedmetadata', () => {
        totalTimeText.innerText = formatTime(video.duration);
    });

    // 4. Play/Pause Logic (Feedback Principle)
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay); // Tap video to play

    function togglePlay() {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = "||"; // Pause icon
        } else {
            video.pause();
            playBtn.innerHTML = "▶"; // Play icon
      }
    }

    // 5. Update Timeline (Feedback)
    video.addEventListener('timeupdate', () => {
        // Update text
        currentTimeText.innerText = formatTime(video.currentTime);
        
        // Update visual bar width
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percentage}%`;
    });

    // 6. Tool Selection Logic (Visual Feedback)
    const tools = document.querySelectorAll('.tool-item');
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            // Remove active class from all
            tools.forEach(t => t.classList.remove('active'));
            // Add to clicked
            tool.classList.add('active');
            
            console.log("Selected Tool: " + tool.dataset.tool);
            // Later: We will switch panels here (Trim vs Filter)
        });
    });

});