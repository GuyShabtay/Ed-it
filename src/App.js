import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './App.css'

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [downloadPressed, setDownloadPressed] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles[0]);
  }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Disable click-to-select
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

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

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)`;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');

        setResultImage(dataUrl);
        resolve();
      };
    });
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
        width: '100vw',
        height: '100vh',
        background: `${isDragActive ? 'yellow' : 'transparent'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
       
      }}
      >
      <input
    type="file"
    id="file-input"
     name="file-input"
    onChange={handleImageChange}
  />
  <div className="drop-or-select">
  <label id="file-input-label" for="file-input">Upload Image</label>
  <p>or drop a file</p>
  </div>
          <input {...getInputProps()} />
        </div>
      ) : (
        <div>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Image"
            style={{
              width: '700px',
              height: '700px',
              margin: 'auto',
              marginBottom: '20px',
              filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)`,
            }}
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
          <div>
            <label htmlFor="sepia">Sepia:</label>
            <input
              type="range"
              id="sepia"
              name="sepia"
              min="0"
              max="100"
              value={sepia}
              onChange={(e) => setSepia(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="grayscale">Grayscale:</label>
            <input
              type="range"
              id="grayscale"
              name="grayscale"
              min="0"
              max="100"
              value={grayscale}
              onChange={(e) => setGrayscale(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="blur">Blur:</label>
            <input
              type="range"
              id="blur"
              name="blur"
              min="0"
              max="10"
              step="0.1"
              value={blur}
              onChange={(e) => setBlur(e.target.value)}
            />
          </div>
          <button onClick={downloadImage}>Download Image</button>
          {resultImage && <img src={resultImage} alt="Result" />}
        </div>
      )}
    </div>
  );
};

export default App