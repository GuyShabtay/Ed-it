import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [removeBackgroundPressed, setRemoveBackgroundPressed] = useState(false);
  const [downloadPressed, setDownloadPressed] = useState(false);
  const apiKey = process.env.API_KEY;

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const applyImageEffects = async () => {
    return new Promise((resolve) => {
      if (!selectedImage) return resolve();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply brightness and contrast
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');

        setResultImage(dataUrl);
        resolve();
      };
    });
  };

  const removeBackground = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', selectedImage);

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
        encoding: null,
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        setResultImage(url);
        setRemoveBackgroundPressed(true);
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const downloadImage = async () => {
    await applyImageEffects(); // Apply effects before downloading
    setDownloadPressed(true);
  };

  const handleImageLoad = () => {
    if (downloadPressed) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'modified_image.png';
      link.click();
      setDownloadPressed(false);
    }
  };

  return (
    <div>
      {!selectedImage ? (
        <div
          {...getRootProps()}
          style={{
            width: '700px',
            height: '700px',
            border: `2px solid ${isDragActive ? 'yellow' : 'purple'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginBottom: '20px',
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? 'Drop the image here' : 'Drag and drop image here or click to select'}
        </div>
      ) : (
        <div>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Image"
            style={{ width: '700px', height: '700px', margin: 'auto', marginBottom: '20px', filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
            onLoad={handleImageLoad}
          />
          <div>
            <label htmlFor="brightness">Brightness:</label>
            <input
              type="range"
              id="brightness"
              name="brightness"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="contrast">Contrast:</label>
            <input
              type="range"
              id="contrast"
              name="contrast"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(e.target.value)}
            />
          </div>
          {!removeBackgroundPressed && <button onClick={removeBackground}>Remove Background</button>}
          <button onClick={downloadImage}>Download Image</button>
          {resultImage && <img src={resultImage} alt="Result" />}
        </div>
      )}
    </div>
  );
};

export default App;
