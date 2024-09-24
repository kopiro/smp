const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("play-pause");
const rewindButton = document.getElementById("rewind");
const forwardButton = document.getElementById("forward");
const trackList = document.getElementById("track-list");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

let currentTrackIndex = 0;
let tracks = [];

// Fetch the list of tracks from the server
fetch("/api/tracks")
  .then((response) => response.json())
  .then((data) => {
    tracks = data;
    loadTrackList(tracks);
  });

// Load track list into the UI
function loadTrackList(tracks) {
  tracks.forEach((track, index) => {
    const li = document.createElement("li");

    const artwork = document.createElement("img");
    artwork.src = track.artwork ?? "/images/default-coverart.jpg";
    artwork.classList.add("artwork");
    li.appendChild(artwork);

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = track.title;
    li.appendChild(title);

    const artist = document.createElement("div");
    artist.classList.add("artist");
    artist.textContent = track.artist;
    li.appendChild(artist);

    const album = document.createElement("div");
    album.classList.add("album");
    album.textContent = track.album;
    li.appendChild(album);

    const duration = document.createElement("div");
    duration.classList.add("duration");
    duration.textContent = track.duration;
    li.appendChild(duration);

    li.addEventListener("click", () => loadTrack(index));
    trackList.appendChild(li);
  });
}

// Load selected track
function loadTrack(index) {
  currentTrackIndex = index;
  audioPlayer.src = tracks[currentTrackIndex].url;
  audioPlayer.play();
}

// Play track
playButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

audioPlayer.addEventListener("play", () => {
  playButton.textContent = "⏸️️";
});

audioPlayer.addEventListener("pause", () => {
  playButton.textContent = "▶️";
});

// Rewind track by 10 seconds
rewindButton.addEventListener("click", () => {
  audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
});

// Forward track by 10 seconds
forwardButton.addEventListener("click", () => {
  audioPlayer.currentTime = Math.min(
    audioPlayer.duration,
    audioPlayer.currentTime + 10
  );
});

// Play previous track
previousButton.addEventListener("click", () => {
  if (currentTrackIndex === 0) {
    currentTrackIndex = tracks.length - 1;
  } else {
    currentTrackIndex = currentTrackIndex - 1;
  }
  loadTrack(currentTrackIndex);
});

// Play next track
nextButton.addEventListener("click", () => {
  if (currentTrackIndex === tracks.length - 1) {
    currentTrackIndex = 0;
  } else {
    currentTrackIndex = currentTrackIndex + 1;
  }
  loadTrack(currentTrackIndex);
});
