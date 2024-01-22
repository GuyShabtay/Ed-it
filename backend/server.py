from fastapi import FastAPI, HTTPException, Form, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import base64
import io
import uvicorn  # Import uvicorn module


app = FastAPI()

# Enable CORS (Cross-Origin Resource Sharing)
origins = ["*"]  # You can adjust the list of allowed origins as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/api/remove-background')
async def remove_background(imageData: str = Form(...), image_file: UploadFile = File(...)):
    try:
        # Decode the base64 image data
        image_bytes = base64.b64decode(imageData)

        # Remove background
        input_image = Image.open(io.BytesIO(image_bytes))
        output_image = remove(input_image)

        # Convert output image to base64
        buffered = io.BytesIO()
        output_image.save(buffered, format="PNG")
        output_image_data = base64.b64encode(buffered.getvalue()).decode('utf-8')

        return JSONResponse(content={'outputImageData': output_image_data})
    
    except Exception as e:
        print(str(e))  # Print the error for debugging
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    app.run()



    
