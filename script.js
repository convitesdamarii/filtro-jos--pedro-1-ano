const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('btn-capture');
const switchBtn = document.getElementById('btn-switch');
let currentStream;
let useFrontCamera = true;

// Inicia a câmera
async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    const constraints = {
        video: { facingMode: useFrontCamera ? "user" : "environment" }
    };
    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;
    } catch (err) {
        alert("Erro ao acessar a câmera: " + err);
    }
}

// Trocar câmera
switchBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
});

// Capturar e Salvar
captureBtn.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenha o vídeo
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Desenha a moldura por cima
    const imgMoldura = new Image();
    imgMoldura.src = 'moldura.png';
    imgMoldura.onload = () => {
        ctx.drawImage(imgMoldura, 0, 0, canvas.width, canvas.height);
        
        // Converte para imagem e baixa
        const link = document.createElement('a');
        link.download = 'minha-foto.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
});

startCamera();