document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const resultElement = document.getElementById('result');
    
    if (uploadButton) {
        uploadButton.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                
                try {
                    const response = await fetch('http://localhost:8080/predict', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const data = await response.json();
                    resultElement.textContent = data.emotion || 'Error';
                } catch (error) {
                    console.error('Error:', error);
                    resultElement.textContent = 'Error';
                }
            } else {
                resultElement.textContent = 'No file selected.';
            }
        });
    }

    const startWebcamButton = document.getElementById('startWebcam');
    const captureButton = document.getElementById('captureButton');
    const webcam = document.getElementById('webcam');
    const webcamCanvas = document.getElementById('webcamCanvas');
    const resultElementWebcam = document.getElementById('result');

    if (startWebcamButton) {
        startWebcamButton.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                webcam.srcObject = stream;
                webcam.play();
                captureButton.disabled = false;
            } catch (error) {
                console.error('Error accessing webcam:', error);
                alert('Error accessing webcam. Please ensure you have granted permission.');
            }
        });
    }

    if (captureButton) {
        captureButton.addEventListener('click', () => {
            const context = webcamCanvas.getContext('2d');
            webcamCanvas.width = webcam.videoWidth;
            webcamCanvas.height = webcam.videoHeight;
            context.drawImage(webcam, 0, 0, webcamCanvas.width, webcamCanvas.height);
            
            webcamCanvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('file', blob, 'webcam.jpg');
                
                try {
                    const response = await fetch('http://localhost:8080/predict', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const data = await response.json();
                    resultElementWebcam.textContent = data.emotion || 'Error';
                } catch (error) {
                    console.error('Error:', error);
                    resultElementWebcam.textContent = 'Error';
                }
            }, 'image/jpeg');
        });
    }
});
