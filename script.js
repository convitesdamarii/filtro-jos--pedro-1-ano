const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const moldura = document.getElementById('moldura');
let currentStream;
let useFrontCamera = true;

// 1. INICIALIZA A CÂMERA EM ALTA RESOLUÇÃO
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

// 2. FUNÇÃO: TROCAR CÂMERA
document.getElementById('btn-inverter').addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

// 3. FUNÇÃO: TIRAR FOTO COM QUALIDADE MÁXIMA
document.getElementById('btn-foto').addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    
    // Força o tamanho Full HD no resultado final
    canvas.width = 1080;
    canvas.height = 1920;

    // Melhora a nitidez do desenho
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

    // Desenha a câmera e depois a moldura por cima
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(moldura, 0, 0, canvas.width, canvas.height);

    // Salva a foto
    const link = document.createElement('a');
    link.download = 'foto-filtro.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});

startCamera();