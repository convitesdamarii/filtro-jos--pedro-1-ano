const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const moldura = document.getElementById('moldura');
let currentStream;
let useFrontCamera = true;

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    
    // Força o vídeo a nunca inverter na tela
    video.style.transform = "none";

    const constraints = {
        video: { 
            facingMode: useFrontCamera ? "user" : "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
    };

    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;
    } catch (err) {
        console.error("Erro ao acessar a câmera: " + err);
    }
}

document.getElementById('btn-inverter').addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

document.getElementById('btn-foto').addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1920;

    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = canvas.width / canvas.height;
    let sw, sh, sx, sy;

    if (videoRatio > canvasRatio) {
        sh = video.videoHeight;
        sw = video.videoHeight * canvasRatio;
        sx = (video.videoWidth - sw) / 2;
        sy = 0;
    } else {
        sw = video.videoWidth;
        sh = video.videoWidth / canvasRatio;
        sx = 0;
        sy = (video.videoHeight - sh) / 2;
    }

    // Desenha o vídeo exatamente como ele aparece, sem inverter nada
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    
    // Desenha a moldura por cima
    ctx.drawImage(moldura, 0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = 'foto-jose-pedro-natural.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});

startCamera();