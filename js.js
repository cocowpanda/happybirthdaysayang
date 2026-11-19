
/* BACKSOUND */
const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.5;

/* NAVIGASI */
function showPage(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // Hentikan backsound saat masuk halaman SONG
  if (id === "song") {
    bgMusic.pause();
  } 
  // Putar kembali saat kembali ke halaman lain
  else if (bgMusic.dataset.started === "true") {
    bgMusic.play().catch(error => {
      console.log("Backsound belum bisa diputar:", error);
    });
  }
}

/* AMPLOP */
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;

  envelopeOpened = true;

  const envelope = document.getElementById("envelope");
  const button = document.getElementById("openButton");

  // Mulai backsound setelah tombol diklik
  bgMusic.dataset.started = "true";
  bgMusic.play().catch(error => {
    console.log("Backsound gagal diputar:", error);
  });

  envelope.classList.add("open");
  button.innerHTML = "OPENING... ♡";
  button.disabled = true;

  setTimeout(() => {
    showPage("menu");

    envelope.classList.remove("open");
    button.innerHTML = "OPEN LETTER ♡";
    button.disabled = false;
    envelopeOpened = false;
  }, 1400);
}

/* PLAYLIST */
const playlist = [
  {
    title: "You!",
    artist: "LANY",
    file: "p.mp3",
    image: "ngambek.jpeg"
  },
  {
    title: "All Of Me",
    artist: "John Legend",
    file: "p2.mp3",
    image: "tut.jpeg"
  }
];

let currentSong = 0;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const vinyl = document.getElementById("vinyl");

const songPhoto = document.getElementById("songPhoto");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const statusText = document.getElementById("status");

/* LOAD LAGU */
function loadSong() {
  const song = playlist[currentSong];

  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;

  songPhoto.style.opacity = "0";

  songPhoto.onload = () => {
    songPhoto.style.opacity = "1";
  };

  songPhoto.src = song.image;
  audio.src = song.file;

  progress.style.width = "0%";
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
}

/* PLAY PAUSE */
function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {
      statusText.textContent = "TIDAK BISA MEMUTAR LAGU";
    });
  } else {
    audio.pause();
  }
}

/* NEXT */
function nextSong() {
  currentSong = (currentSong + 1) % playlist.length;
  loadSong();

  audio.play().catch(() => {
    statusText.textContent = "PAUSED ♡";
  });
}

/* PREVIOUS */
function prevSong() {
  currentSong =
    (currentSong - 1 + playlist.length) % playlist.length;

  loadSong();

  audio.play().catch(() => {
    statusText.textContent = "PAUSED ♡";
  });
}

/* EVENT PLAY */
audio.addEventListener("play", () => {
  playBtn.textContent = "Ⅱ";
  vinyl.classList.add("playing");
  statusText.textContent = "NOW PLAYING ♡";
});

/* EVENT PAUSE */
audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
  vinyl.classList.remove("playing");
  statusText.textContent = "PAUSED ♡";
});

/* PROGRESS */
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent =
      (audio.currentTime / audio.duration) * 100;

    progress.style.width = percent + "%";

    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  }
});

/* FORMAT WAKTU */
function formatTime(time) {
  if (isNaN(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return minutes + ":" + String(seconds).padStart(2, "0");
}

/* KLIK PROGRESS BAR */
document.getElementById("progressBar").addEventListener("click", e => {
  if (audio.duration) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    audio.currentTime =
      (clickX / rect.width) * audio.duration;
  }
});

/* AUTO NEXT */
audio.addEventListener("ended", nextSong);

/* LOAD LAGU PERTAMA */
loadSong();

/* CONFETTI */
const colors = [
  "#ff4d6d",
  "#ffd166",
  "#06d6a0",
  "#4cc9f0",
  "#c77dff",
  "#ffffff",
  "#ff9f1c"
];

for (let i = 0; i < 45; i++) {
  const piece = document.createElement("span");

  piece.className = "confetti";
  piece.style.left = Math.random() * 100 + "vw";

  piece.style.backgroundColor =
    colors[Math.floor(Math.random() * colors.length)];

  piece.style.width = (Math.random() * 5 + 4) + "px";
  piece.style.height = (Math.random() * 7 + 5) + "px";
  piece.style.animationDuration = (Math.random() * 5 + 5) + "s";
  piece.style.animationDelay = (Math.random() * 6) + "s";

  document.body.appendChild(piece);
}

/* MATIKAN MUSIK SAAT MENINGGALKAN WEBSITE */

// Saat halaman ditutup atau ditinggalkan
window.addEventListener("pagehide", function () {
  bgMusic.pause();
  audio.pause();

  bgMusic.currentTime = 0;
  audio.currentTime = 0;
});

// Saat berpindah aplikasi atau tab browser
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    bgMusic.pause();
    audio.pause();
  }
});
