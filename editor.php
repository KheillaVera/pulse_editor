<?php
// editor.php
include 'db.php'; // Connect to DB

// 1. Check for Project ID
if (isset($_GET['id'])) {
    $projectId = mysqli_real_escape_string($conn, $_GET['id']);

    // 2. Fetch Project Details from Database
    $sql = "SELECT * FROM projects WHERE id='$projectId'";
    $result = mysqli_query($conn, $sql);
    $project = mysqli_fetch_assoc($result);

    if ($project) {
        $videoFile = $project['project_name']; // The User's Name (e.g. "My Dance")
        $videoPath = $project['file_path'];    // The System Path
    } else {
        echo "Project not found!";
        exit();
    }
} else {
    header("Location: index.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pulse Editor | <?php echo $videoFile; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap" rel="stylesheet">
</head>
<body class="editor-mode">

    <nav class="editor-nav">
        <div class="nav-left">
            <a href="index.html" class="back-btn">← Back</a>
            <span class="file-name"><?php echo $videoFile; ?></span>
        </div>
        <div class="nav-right">
            <button id="exportBtn" class="btn-primary small-btn">Export Video</button>
        </div>
    </nav>

    <div class="workspace">
        
        <aside class="sidebar">
            <section class="tool-panel-area" id="toolPanelArea">
    
    <div class="panel-content" id="panel-trim">
        <h3>Trim Video</h3>
        <p class="instruction">Drag the timeline handles below to cut.</p>
        </div>

    <div class="panel-content" id="panel-filter">
        <h3>Filters</h3>
        <div class="filter-grid">
            <button class="filter-btn" onclick="applyFilter('none')">Normal</button>
            <button class="filter-btn" onclick="applyFilter('grayscale(100%)')">B&W</button>
            <button class="filter-btn" onclick="applyFilter('sepia(60%)')">Vintage</button>
            <button class="filter-btn" onclick="applyFilter('contrast(150%)')">Drama</button>
            <button class="filter-btn" onclick="applyFilter('hue-rotate(90deg)')">Cyber</button>
            <button class="filter-btn" onclick="applyFilter('hue-rotate(90deg)')">rio de jainero</button>
            <button class="filter-btn" onclick="applyFilter('hue-rotate(90deg)')">tokyo</button>
            <button class="filter-btn" onclick="applyFilter('hue-rotate(90deg)')">hyper</button>
        </div>

        <h3>Adjustments</h3>
        <div class="slider-group">
            <label>Brightness</label>
            <input type="range" min="50" max="150" value="100" oninput="updateSettings(this, 'brightness')">
        </div>
        <div class="slider-group">
            <label>Contrast</label>
            <input type="range" min="50" max="200" value="100" oninput="updateSettings(this, 'contrast')">
        </div>
    </div>

    <div class="panel-content" id="panel-audio">
        <h3>Audio</h3>
        <button class="btn-primary small-btn">Upload Music +</button>
    </div>

</section>
            <div class="tool-item active" data-tool="trim">
                <span class="icon">✂️</span>
                <span class="label">Trim</span>
            </div>
            <div class="tool-item" data-tool="filter">
                <span class="icon">🎨</span>
                <span class="label">Filters</span>
            </div>
            <div class="tool-item" data-tool="audio">
                <span class="icon">🎵</span>
                <span class="label">Audio</span>
            </div>
            <div class="tool-item" data-tool="text">
                <span class="icon">Tt</span>
                <span class="label">Text</span>
            </div>
        </aside>

        <section class="tool-panel-area" id="toolPanelArea">
            
            <div class="panel-content" id="panel-trim">
                <h3>Trim Video</h3>
                <p class="instruction">Drag the timeline handles below to cut.</p>
                <button class="btn-primary small-btn" style="margin-top:10px;">Apply Cut</button>
            </div>

            <div class="panel-content" id="panel-filter">
                <h3>Filters</h3>
                <div class="filter-grid">
                    <button class="filter-btn" onclick="applyFilter('none')">Normal</button>
                    <button class="filter-btn" onclick="applyFilter('grayscale(100%)')">B&W</button>
                    <button class="filter-btn" onclick="applyFilter('sepia(60%)')">Vintage</button>
                    <button class="filter-btn" onclick="applyFilter('contrast(150%)')">Drama</button>
                    <button class="filter-btn" onclick="applyFilter('hue-rotate(90deg)')">Cyber</button>
                </div>

                <h3>Adjustments</h3>
                <div class="slider-group">
                    <label>Brightness</label>
                    <input type="range" min="50" max="150" value="100" oninput="updateSettings(this, 'brightness')">
                </div>
                <div class="slider-group">
                    <label>Contrast</label>
                    <input type="range" min="50" max="200" value="100" oninput="updateSettings(this, 'contrast')">
                </div>
            </div>

            <div class="panel-content" id="panel-audio">
                <h3>Audio</h3>
                <button class="btn-primary small-btn">Upload Music +</button>
            </div>
        </section>

        <main class="preview-stage">
            <div class="video-container">
                <video id="mainVideo" src="<?php echo $videoPath; ?>" playsinline loop></video>
                <div class="controls-overlay">
                    <button id="playPauseBtn" class="control-btn">▶</button>
                </div>
            </div>
        </main>
    </div>

    <footer class="timeline-panel">
        <div class="time-readout">
            <span id="currentTime">00:00</span> / <span id="totalTime">00:00</span>
        </div>
        <div class="track-container" id="timelineTrack">
            <div class="progress-bar" id="progressBar"></div>
        </div>
    </footer>

    <script src="assets/js/editor.js"></script>

</body>
</html>