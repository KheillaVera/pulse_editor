<?php
// upload_handler.php
include 'db.php'; 

if (isset($_POST['submit'])) {
    
    $file = $_FILES['video_file'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    
    // Get Extension
    $fileExt = explode('.', $file['name']);
    $fileActualExt = strtolower(end($fileExt));
    $allowed = array('mp4', 'mov', 'webm', 'mkv');

    if (in_array($fileActualExt, $allowed)) {
        if ($fileError === 0) {
            
            // 1. Generate System File Name (Hidden from user)
            // e.g., "65b21...mp4"
            $fileNameNew = uniqid('', true) . "." . $fileActualExt;
            $fileDestination = 'uploads/' . $fileNameNew;

            // 2. Generate Cool Display Name (Visible to user)
            // It will look like: "Sequence 482" or "Edit 901"
            $randomID = rand(100, 999);
            $projectName = "Sequence " . $randomID; 

            if (move_uploaded_file($fileTmpName, $fileDestination)) {
                
                // 3. Save to DB
                $sql = "INSERT INTO projects (project_name, file_name, file_path) 
                        VALUES ('$projectName', '$fileNameNew', '$fileDestination')";
                
                if (mysqli_query($conn, $sql)) {
                    $newProjectId = mysqli_insert_id($conn);
                    header("Location: editor.php?id=" . $newProjectId);
                    exit();
                } else {
                    echo "Database Error.";
                }

            } else {
                echo "Error moving file.";
            }
        } else {
            echo "Upload error.";
        }
    } else {
        echo "Invalid file type.";
    }
}
?>