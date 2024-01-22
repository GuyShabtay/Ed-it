from flask import Flask, jsonify, request
from flask_cors import CORS
from rembg import remove
from PIL import Image
import base64
import io

app = Flask(__name__)
CORS(app)

# @app.get("/")
# def run():
#     return "Server Running"

@app.route('/')
def hello_world():
    return 'Hello World!'

# @app.route('/api/remove-background', methods=['POST'])
# def remove_background():
#     try:
#         image_data = request.json.get('imageData')
#         image_bytes = base64.b64decode(image_data)

#         input_image = Image.open(io.BytesIO(image_bytes))
#         output_image = remove(input_image)

#         buffered = io.BytesIO()
#         output_image.save(buffered, format="PNG")
#         output_image_data = base64.b64encode(buffered.getvalue()).decode('utf-8')

#         return jsonify({'outputImageData': output_image_data})

#     except Exception as e:
#         print(str(e))  
#         return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run()
