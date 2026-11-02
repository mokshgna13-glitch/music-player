const audio = document.getElementById("audio");

const musicInput = document.getElementById("musicInput");

const songList = document.getElementById("songList");
const songCount = document.getElementById("songCount");

const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");

const playButton = document.getElementById("play");

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const volume = document.getElementById("volume");

const album = document.getElementById("album");


let songs = [];
let currentSong = -1;

let shuffled = false;
let repeat = false;


/* ADD MUSIC */

musicInput.addEventListener("change", function () {

  const files = [...this.files];

  files.forEach(file => {

    songs.push({
      name: file.name.replace(/\.[^/.]+$/, ""),
      file: file,
      url: URL.createObjectURL(file)
    });

  });

  renderSongs();

  if (currentSong === -1 && songs.length > 0) {
    loadSong(0);
  }

});


/* RENDER LIBRARY */

function renderSongs() {

  songList.innerHTML = "";

  songCount.textContent =
    `${songs.length} ${songs.length === 1 ? "song" : "songs"}`;


  if (songs.length === 0) {

    songList.innerHTML = `
      <div class="empty">
        Your library is empty.<br>
        Add some music to get started.
      </div>
    `;

    return;
  }


  songs.forEach((song, index) => {

    const row = document.createElement("div");

    row.className = "song";

    if (index === currentSong) {
      row.classList.add("active");
    }

    row.innerHTML = `
      <span class="song-number">
        ${String(index + 1).padStart(2, "0")}
      </span>

      <span class="song-title">
        ${escapeHTML(song.name)}
      </span>

      <span class="song-duration">
        —
      </span>
    `;


    row.addEventListener("click", () => {

      loadSong(index);
      playSong();

    });


    songList.appendChild(row);

  });

}


/* LOAD SONG */

function loadSong(index) {

  if (!songs[index]) return;

  currentSong = index;

  const song = songs[index];

  audio.src = song.url;

  songTitle.textContent = song.name;

  artist.textContent = "Local file";

  progress.value = 0;

  currentTime.textContent = "0:00";

  totalTime.textContent = "0:00";

  renderSongs();

}


/* PLAY */

function playSong() {

  if (currentSong === -1 && songs.length > 0) {
    loadSong(0);
  }

  if (currentSong === -1) return;

  audio.play();

  playButton.textContent = "Ⅱ";

  album.classList.add("playing");

}


/* PAUSE */

function pauseSong() {

  audio.pause();

  playButton.textContent = "▶";

  album.classList.remove("playing");

}


/* PLAY / PAUSE */

playButton.addEventListener("click", () => {

  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }

});


/* NEXT */

nextButton.addEventListener("click", nextSong);


function nextSong() {

  if (songs.length === 0) return;


  let nextIndex;


  if (shuffled) {

    nextIndex =
      Math.floor(Math.random() * songs.length);

  } else {

    nextIndex = currentSong + 1;

    if (nextIndex >= songs.length) {
      nextIndex = 0;
    }

  }


  loadSong(nextIndex);

  playSong();

}


/* PREVIOUS */

previousButton.addEventListener("click", () => {

  if (songs.length === 0) return;


  let previousIndex = currentSong - 1;

  if (previousIndex < 0) {
    previousIndex = songs.length - 1;
  }

  loadSong(previousIndex);

  playSong();

});


/* SHUFFLE */

shuffleButton.addEventListener("click", () => {

  shuffled = !shuffled;

  shuffleButton.style.fontWeight =
    shuffled ? "bold" : "normal";

});


/* REPEAT */

repeatButton.addEventListener("click", () => {

  repeat = !repeat;

  repeatButton.style.fontWeight =
    repeat ? "bold" : "normal";

});


/* WHEN SONG ENDS */

audio.addEventListener("ended", () => {

  if (repeat) {

    audio.currentTime = 0;

    playSong();

  } else {

    nextSong();

  }

});


/* PROGRESS */

audio.addEventListener("timeupdate", () => {

  if (!audio.duration) return;

  progress.value =
    (audio.currentTime / audio.duration) * 100;

  currentTime.textContent =
    formatTime(audio.currentTime);

  totalTime.textContent =
    formatTime(audio.duration);

});


/* SEEK */

progress.addEventListener("input", () => {

  if (!audio.duration) return;

  audio.currentTime =
    (progress.value / 100) * audio.duration;

});


/* VOLUME */

volume.addEventListener("input", () => {

  audio.volume = volume.value;

});

audio.volume = 0.8;


/* TIME FORMAT */

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const remaining =
    Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;

}


/* BASIC HTML ESCAPING */

function escapeHTML(text) {

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}