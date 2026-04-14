const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const moldura = document.getElementById('moldura');
let currentStream;
let useFrontCamera = true;

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
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
    const ctx = canvas.getContext('2d'); // <-- O 'ctx' que você procurava está aqui!
    
    canvas.width = 1080;
    canvas.height = 1920;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

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

    // AJUSTE PARA A FOTO NA GALERIA NÃO FICAR ESPELHADA
    if (useFrontCamera) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    
    // Volta ao normal para a moldura não inverter
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(moldura, 0, 0, canvas.width, canvas.height);

    const link = document.createElement('a');
    link.download = 'foto-jose-pedro.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});

startCamera();