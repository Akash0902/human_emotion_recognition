from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from keras.models import load_model
from PIL import Image
import numpy as np
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = load_model('models/emotion_recognition.h5')

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read the file
        contents = await file.read()
        
        # Open the image
        image = Image.open(io.BytesIO(contents))
        image = image.convert('L')  # Convert to grayscale
        image = image.resize((48, 48))
        image_array = np.array(image) / 255.0
        image_array = np.reshape(image_array, (1, 48, 48, 1))
        
        # Predict emotion
        prediction = model.predict(image_array)
        emotion = np.argmax(prediction[0])

        labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
        return JSONResponse(content={'emotion': labels[emotion]})
    except Exception as e:
        return JSONResponse(content={'error': str(e)}, status_code=500)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="localhost", port=8080)
