import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure upload folders exist
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Config multer storage inside the uploads path
const upload = multer({ dest: UPLOADS_DIR });

// Dynamic resolver for FFmpeg path on Windows (especially when path changes aren't yet loaded in parent process)
function getFfmpegPath(): string {
  const wingetFFmpegDir = 'C:\\Users\\harih\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe';
  if (fs.existsSync(wingetFFmpegDir)) {
    try {
      const subdirs = fs.readdirSync(wingetFFmpegDir);
      for (const subdir of subdirs) {
        const binPath = path.join(wingetFFmpegDir, subdir, 'bin', 'ffmpeg.exe');
        if (fs.existsSync(binPath)) {
          return `"${binPath}"`;
        }
      }
    } catch (e) {
      console.error('Error scanning winget directory:', e);
    }
  }
  return 'ffmpeg';
}

// Route to convert video (MP4/WebM) to GIF using FFmpeg
app.post('/api/video-to-gif', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file was uploaded' });
  }

  const inputPath = req.file.path;
  const outputFileName = `${req.file.filename}.gif`;
  const outputPath = path.join(UPLOADS_DIR, outputFileName);

  // FFmpeg command optimized for smaller size and high fidelity
  // scale=480:-1 restricts width to 480px, maintaining aspect ratio.
  // fps=15 captures standard frames. palettegen and paletteuse prevent color banding.
  const ffmpegExe = getFfmpegPath();
  const ffmpegCmd = `${ffmpegExe} -i "${inputPath}" -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${outputPath}"`;

  exec(ffmpegCmd, (error, stdout, stderr) => {
    // Delete raw incoming video immediately to protect space
    fs.unlink(inputPath, (unlinkErr) => {
      if (unlinkErr) console.error(`Error deleting input video: ${unlinkErr}`);
    });

    if (error) {
      console.error(`FFmpeg processing failed: ${error.message}`);
      return res.status(500).json({ error: 'FFmpeg transformation failed' });
    }

    // Return the file, then purge the file from server storage once download finishes
    res.download(outputPath, 'converted.gif', (downloadErr) => {
      if (downloadErr) {
        console.error(`Error during file download: ${downloadErr}`);
      }
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) console.error(`Error deleting converted GIF: ${unlinkErr}`);
      });
    });
  });
});

// Storage Lifecycle Manager: Runs every 15 minutes (node-cron)
// Purges any temporary files that are older than 15 minutes (in case request cycles failed/aborted)
cron.schedule('*/15 * * * *', () => {
  const now = Date.now();
  const MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      console.error('Lifecycle Manager: Failed to read uploads directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) return;

        const ageMs = now - stats.mtimeMs;
        if (ageMs > MAX_AGE_MS) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Lifecycle Manager: Failed to delete stale resource ${file}:`, unlinkErr);
            } else {
              console.log(`Lifecycle Manager: Successfully deleted stale resource: ${file} (Age: ${Math.round(ageMs / 1000 / 60)} mins)`);
            }
          });
        }
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Express microservice running on http://localhost:${PORT}`);
  console.log(`Automated storage lifecycle manager initialized.`);
});
