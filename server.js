const express = require("express");
const fs = require("fs");
const path = require("path");
const ID3 = require("node-id3");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Directory where MP3 files are stored
const musicDir = path.join(__dirname, "music");

// API endpoint to get list of MP3 files with metadata
app.get("/api/tracks", (req, res) => {
  fs.readdir(musicDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to fetch files" });
    }

    const tracks = files
      .filter((file) => file.endsWith(".mp3"))
      .map((file) => {
        const filePath = path.join(musicDir, file);
        const tags = ID3.read(filePath);

        // Write the artwork to file system
        const artworkName = "/artwork/" + file.replace(".mp3", ".jpg");
        const artworkPath = path.join(__dirname, artworkName);
        let finalArtworkName = "/images/default-coverart.jpg";
        if (fs.existsSync(artworkPath)) {
          finalArtworkName = artworkName;
        } else {
          if (tags.image?.imageBuffer) {
            fs.writeFileSync(artworkPath, tags.image.imageBuffer);
            finalArtworkName = artworkName;
          }
        }

        return {
          name: file,
          url: `/music/${file}`,
          artist: tags.artist || "Unknown Artist",
          title: tags.title || "Unknown Title",
          album: tags.album || "Unknown Album",
          duration: tags.duration ?? "0:00",
          artwork: finalArtworkName,
        };
      });

    res.json(tracks);
  });
});

// Serve MP3 files
app.use("/music", express.static(musicDir));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
