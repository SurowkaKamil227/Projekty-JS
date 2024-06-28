
const sounds = {
    'a': new Audio('sounds/kick.wav'),
    's': new Audio('sounds/snare.wav'),
    'd': new Audio('sounds/hihat.wav'),
    'f': new Audio('sounds/tom.wav')
};

let channels = [];
let recordingChannel = null;
let startTime = null;
let metronomeInterval = null;
let loopInterval = null;
let loopLength = 4000; // Default loop length in milliseconds

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    playSound(key);
});

document.querySelectorAll('.button[data-key]').forEach(button => {
    button.addEventListener('click', () => {
        const key = button.getAttribute('data-key');
        playSound(key);
    });
});

function playSound(key) {
    const sound = sounds[key];
    if (sound) {
        sound.currentTime = 0;  // Rewind to start
        sound.play();
        if (recordingChannel !== null) {
            const timestamp = Date.now() - startTime;
            channels[recordingChannel].push({ key, timestamp });
        }
    }
}

function addChannel() {
    const channelIndex = channels.length;
    channels.push([]);

    const container = document.getElementById('channels-container');
    const label = document.createElement('label');
    label.className = 'checkbox';
    label.innerHTML = `<input type="checkbox" id="channel${channelIndex}"> Channel ${channelIndex + 1}`;
    container.appendChild(label);
}

function removeChannel() {
    if (channels.length > 0) {
        channels.pop();

        const container = document.getElementById('channels-container');
        container.removeChild(container.lastChild);
    }
}

function startRecording() {
    stopRecording();
    const channelIndex = channels.length - 1;
    if (channelIndex >= 0) {
        recordingChannel = channelIndex;
        channels[channelIndex] = [];
        startTime = Date.now();
    }
}

function stopRecording() {
    recordingChannel = null;
}

function playback(channel) {
    if (channels[channel]) {
        channels[channel].forEach(note => {
            setTimeout(() => playSound(note.key), note.timestamp);
        });
    }
}

function playbackSelectedChannels() {
    clearInterval(loopInterval);
    loopLength = parseInt(document.getElementById('loop-length').value);
    const selectedChannels = [];
    for (let i = 0; i < channels.length; i++) {
        if (document.getElementById(`channel${i}`).checked) {
            selectedChannels.push(i);
        }
    }
    selectedChannels.forEach(playback);
    loopInterval = setInterval(() => {
        selectedChannels.forEach(playback);
    }, loopLength);
}

function toggleLoop() {
    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
    } else {
        playbackSelectedChannels();
    }
}

function toggleMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    } else {
        const bpm = parseInt(document.getElementById('bpm').value);
        const interval = 60000 / bpm;
        metronomeInterval = setInterval(() => playSound('a'), interval); // Use kick sound as metronome tick
    }
}
