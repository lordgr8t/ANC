console.log("js here")
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let microphone, scriptProcessor;

document.getElementById('startButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            microphone = audioContext.createMediaStreamSource(stream);
            scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (event) => {
                const inputBuffer = event.inputBuffer.getChannelData(0);
                const outputBuffer = event.outputBuffer.getChannelData(0);

                for (let i = 0; i < inputBuffer.length; i++) {
                    outputBuffer[i] = -inputBuffer[i]; // Инверсия сигнала
                }
            };

            microphone.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            document.getElementById('status').innerText = 'Статус: Запись идет...';
            document.getElementById('startButton').disabled = true;
            document.getElementById('stopButton').disabled = false;
        })
        .catch(err => {
            console.error('Ошибка доступа к микрофону:', err);
            document.getElementById('status').innerText = 'Ошибка доступа к микрофону.';
        });
}

function stopRecording() {
    if (microphone) {
        microphone.disconnect();
        scriptProcessor.disconnect();
        document.getElementById('status').innerText = 'Статус: Запись остановлена.';
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
    }
}