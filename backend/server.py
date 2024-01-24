from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import base64
import io

app = FastAPI()

# Enable CORS (Cross-Origin Resource Sharing) for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def run():
    return {"message": "Server Running"}

@app.post("/api/remove-background")
async def remove_background(image: UploadFile = Form(...)):
    try:
        # Read image file
        image_data = await image.read()

        # Remove background
        input_image = Image.open(io.BytesIO(image_data))
        output_image = remove(input_image)

        # Convert output image to base64
        buffered = io.BytesIO()
        output_image.save(buffered, format="PNG")
        output_image_data = base64.b64encode(buffered.getvalue()).decode('utf-8')

        return {"outputImageData": output_image_data}

    except Exception as e:
        print(str(e))  # Print the error for debugging
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn

    # Run the application using Uvicorn server
    uvicorn.run(app, host='0.0.0.0', port=5000)
