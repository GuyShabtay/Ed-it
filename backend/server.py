import tornado.ioloop
import tornado.web
from tornado.escape import json_decode
from rembg import remove
from PIL import Image
import base64
import io

class MainHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")

    def get(self):
        self.write("Server is running")  # Respond with something meaningful here



    def options(self):
        # no body
        self.set_status(204)
        self.finish()

    async def post(self):
        try:
            request_data = json_decode(self.request.body)
            image_data = base64.b64decode(request_data['imageData'])
            input_image = Image.open(io.BytesIO(image_data))
            output_image = remove(input_image)
            buffered = io.BytesIO()
            output_image.save(buffered, format="PNG")
            output_image_data = base64.b64encode(buffered.getvalue()).decode('utf-8')
            self.write({"outputImageData": output_image_data})
        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),  # Add a route for the root URL
        (r"/api/remove-background", MainHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8000, address='0.0.0.0')
    tornado.ioloop.IOLoop.current().start()

