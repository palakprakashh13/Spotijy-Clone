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

// Individual song play buttons
Array.from(document.getElementsByClassName('songItemPlay')).forEach((el) => {
    el.addEventListener('click', (e) => {
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        e.target.classList.remove('fa-circle-play');
        e.target.classList.add('fa-circle-pause');
        audioElement.src = `songs/${songIndex + 1}.mp3`;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
    });
});

// Next button
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    audioElement.src = `songs/${songIndex + 1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
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
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    makeAllPlays();
    document.getElementsByClassName('songItemPlay')[songIndex].classList.remove('fa-circle-play');
    document.getElementsByClassName('songItemPlay')[songIndex].classList.add('fa-circle-pause');
});

// Show all feedback from localStorage
function displayFeedback() {
    const feedbackList = document.getElementById('feedbackList');
    if (!feedbackList) return;

    feedbackList.innerHTML = "";
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

    feedbacks.forEach(fb => {
        const li = document.createElement('li');
        li.textContent = fb;
        feedbackList.appendChild(li);
    });
}

window.addEventListener('DOMContentLoaded', displayFeedback);

// Unified Feedback Handler
document.getElementById('feedbackForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const feedback = this.feedback.value.trim();
    const status = document.getElementById('feedbackStatus');

    if (!feedback) {
        status.textContent = "Please write something!";
        return;
    }

    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    displayFeedback();

    fetch("https://script.google.com/macros/s/AKfycbxN3M4LZMtOyLA8BTnq21sN4ewfAuAm98IUb2kfgqW3aL-2YzUTkngh56dUM3e0WBog/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `feedback=${encodeURIComponent(feedback)}`
    })
    .then(res => res.text())
    .then(() => {
        status.textContent = "Thank you for your feedback!";
        this.reset();
    })
    .catch(err => {
        console.error(err);
        status.textContent = "Error submitting feedback. Try again later.";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Your chatbot logic here
    const chatIcon = document.getElementById("chatIcon");
    const chatbot = document.getElementById("chatbot");
    const closeChat = document.getElementById("closeChat");
    const sendBtn = document.getElementById("sendBtn");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");

    chatIcon.onclick = () => chatbot.style.display = "flex";
    closeChat.onclick = () => chatbot.style.display = "none";

    sendBtn.onclick = () => {
        const input = userInput.value.trim().toLowerCase();
        if (!input) return;

        addMessage("You", input);
        respond(input);
        userInput.value = "";
    };

    function addMessage(sender, text) {
        const msg = document.createElement("div");
        msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    function respond(input) {
        const lowerInput = input.toLowerCase();
        let response = "";
    
        const responses = [
            {
                match: ["hi", "hello", "hey"],
                reply: ["Hey there! 😊", "Hello! How can I help you today?", "Hi! Ready to jam? 🎶"]
            },
            {
                match: ["how are you", "what's up", "how’s it going"],
                reply: ["I'm vibin' 😎 How about you?", "Doing great! Just playing some beats 🎧"]
            },
            {
                match: ["your name", "who are you"],
                reply: ["I'm Jammr, your music buddy! 🎵"]
            },
            {
                match: ["what can you do", "features", "help"],
                reply: ["I can suggest songs, genres, artists, and keep you company while you vibe 🎶"]
            },
            {
                match: ["rock", "pop", "lofi", "romantic", "party"],
                reply: {
                    "rock": "🎸 Rock on with Linkin Park, Imagine Dragons, or Arctic Monkeys!",
                    "pop": "🎤 Pop hits? Try Dua Lipa, Harry Styles, or Taylor Swift!",
                    "lofi": "☕ Chill out with Lofi Girl, Chillhop, and late night vibes.",
                    "romantic": "❤️ Feel the love with Arijit Singh, Ed Sheeran, or Bollywood melodies!",
                    "party": "🎉 Get the party started with David Guetta, Badshah, and Neha Kakkar!"
                }
            },
            {
                match: ["joke"],
                reply: ["Why don’t skeletons fight each other? Because they don’t have the guts! 😄"]
            },
            {
                match: ["fun fact", "did you know"],
                reply: ["Flamingos are pink because of the shrimp they eat! 🦩"]
            },
            {
                match: ["thank you", "thanks"],
                reply: ["Anytime! ✨ Enjoy the music!"]
            },
            {
                match: ["bye", "goodbye"],
                reply: ["Goodbye! ✌️ Come back anytime to vibe!"]
            }
        ];
    
        let matched = false;
    
        responses.forEach(item => {
            if (Array.isArray(item.match)) {
                item.match.forEach(keyword => {
                    if (lowerInput.includes(keyword)) {
                        matched = true;
                        if (typeof item.reply === "string") {
                            response = item.reply;
                        } else if (Array.isArray(item.reply)) {
                            response = item.reply[Math.floor(Math.random() * item.reply.length)];
                        } else if (typeof item.reply === "object") {
                            response = item.reply[keyword];
                        }
                    }
                });
            }
        });
    
        if (!matched) {
            const fallbackResponses = [
                "Hmm... I didn’t get that, but I'm still learning! 😊",
                "Interesting! Tell me more!",
                "I'm better with music stuff, but I love chatting too!"
            ];
            response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    
        addMessage("Jammr", response);
    }
    
    
    
    
});
