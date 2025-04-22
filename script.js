console.log("Welcome to Jammr");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    { songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Janji-Heroes-Tonight-feat-Johnning-NCS-Release", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Rabba - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/6.jpg" },
    { songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/7.jpg" },
    { songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/8.jpg" },
    { songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/9.jpg" },
    { songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/4.mp3", coverPath: "covers/10.jpg" },
];

// Function to log song history
function logSongHistory(songName) {
    const now = new Date();
    const timestamp = now.toLocaleString();
    let history = JSON.parse(localStorage.getItem("playHistory")) || [];
    history.push({ song: songName, time: timestamp });
    localStorage.setItem("playHistory", JSON.stringify(history));
}

// Display song list
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Reset all play icons
const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((el) => {
        el.classList.remove('fa-circle-pause');
        el.classList.add('fa-circle-play');
    });
};

// Master play/pause button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        logSongHistory(songs[songIndex].songName);
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;
        makeAllPlays();
        document.getElementsByClassName('songItemPlay')[songIndex].classList.remove('fa-circle-play');
        document.getElementsByClassName('songItemPlay')[songIndex].classList.add('fa-circle-pause');
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        gif.style.opacity = 0;
        makeAllPlays();
    }
});

// Update seekbar
audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
});

// Seekbar control
myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// ✅ Updated: Individual song play/pause toggle
Array.from(document.getElementsByClassName('songItemPlay')).forEach((el) => {
    el.addEventListener('click', (e) => {
        let clickedIndex = parseInt(e.target.id);

        if (clickedIndex === songIndex) {
            if (audioElement.paused) {
                audioElement.play();
                e.target.classList.remove('fa-circle-play');
                e.target.classList.add('fa-circle-pause');
                gif.style.opacity = 1;
                masterPlay.classList.remove('fa-circle-play');
                masterPlay.classList.add('fa-circle-pause');
            } else {
                audioElement.pause();
                e.target.classList.remove('fa-circle-pause');
                e.target.classList.add('fa-circle-play');
                gif.style.opacity = 0;
                masterPlay.classList.remove('fa-circle-pause');
                masterPlay.classList.add('fa-circle-play');
            }
        } else {
            makeAllPlays();
            songIndex = clickedIndex;
            e.target.classList.remove('fa-circle-play');
            e.target.classList.add('fa-circle-pause');
            audioElement.src = `songs/${songIndex + 1}.mp3`;
            masterSongName.innerText = songs[songIndex].songName;
            audioElement.currentTime = 0;
            audioElement.play();
            logSongHistory(songs[songIndex].songName);
            gif.style.opacity = 1;
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
        }
    });
});

// Next button
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    audioElement.src = `songs/${songIndex + 1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    logSongHistory(songs[songIndex].songName);
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    makeAllPlays();
    document.getElementsByClassName('songItemPlay')[songIndex].classList.remove('fa-circle-play');
    document.getElementsByClassName('songItemPlay')[songIndex].classList.add('fa-circle-pause');
});

// Previous button
document.getElementById('previous').addEventListener('click', () => {
    songIndex = songIndex <= 0 ? 0 : songIndex - 1;
    audioElement.src = `songs/${songIndex + 1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    logSongHistory(songs[songIndex].songName);
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    makeAllPlays();
    document.getElementsByClassName('songItemPlay')[songIndex].classList.remove('fa-circle-play');
    document.getElementsByClassName('songItemPlay')[songIndex].classList.add('fa-circle-pause');
});

// === Prevent cursor focus on click anywhere ===
document.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.activeElement.blur();
});


