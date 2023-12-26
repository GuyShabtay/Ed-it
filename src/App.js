import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import html2canvas from 'html2canvas';
import './App.css';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const [downloadPressed, setDownloadPressed] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles[0]);
  }, []);

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
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) invert(${inversion}%)`;
        ctx.canvas.style.borderRadius = `${borderRadius}%`;

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
    // Apply effects before downloading
    await applyImageEffects();

    // Check if the border radius is changed
    if (borderRadius !== 0) {
      // Use HTML2Canvas to capture the modified image
      html2canvas(document.getElementById('image-container')).then((canvas) => {
        const dataUrl = canvas.toDataURL('image/jpeg');

        // Trigger the download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'modified_image.png';
        link.click();
      });
    } else {
      // If border radius is not changed, use the original resultImage for download
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'modified_image.png';
      link.click();
    }

    // Reset the downloadPressed state
    setDownloadPressed(false);
  };

  const handleImageLoad = () => {
    if (downloadPressed) {
      // Check if the border radius is changed
      if (borderRadius !== 0) {
        // Use HTML2Canvas to capture the modified image
        html2canvas(document.getElementById('image-container')).then((canvas) => {
          const dataUrl = canvas.toDataURL('image/jpeg');

          // Trigger the download
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'modified_image.png';
          link.click();
        });
      } else {
        // If border radius is not changed, use the original resultImage for download
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'modified_image.png';
        link.click();
      }

      // Reset the downloadPressed state
      setDownloadPressed(false);
    }
  };

  return (
    <div>
      {!selectedImage ? (
        <div
          className={!isDragActive ? 'drop-zone' : 'drop-zone active-drop-zone'}
          {...getRootProps()}
        >
          <input
            type="file"
            id="file-input"
            name="file-input"
            onChange={handleImageChange}
          />
          <div className="drop-or-select">
            {!isDragActive ? (
              <div>
                <label id="file-input-label" htmlFor="file-input">
                  Upload Image
                </label>
                <p>or drop a file</p>
              </div>
            ) : (
              <h1>Drop image anywhere</h1>
            )}
          </div>
          <input {...getInputProps()} />
        </div>
      ) : (
        <div className="edit">
          <div className="sliders">
            <div className="slider">
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
            <div className="slider">
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
            <div className="slider">
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
            <div className="slider">
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
            <div className="slider">
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
            <div className="slider">
              <label htmlFor="hue">Hue:</label>
              <input
                type="range"
                id="hue"
                name="hue"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(e.target.value)}
              />
            </div>
            <div className="slider">
              <label htmlFor="saturation">Saturation:</label>
              <input
                type="range"
                id="saturation"
                name="saturation"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(e.target.value)}
              />
            </div>
            <div className="slider">
              <label htmlFor="inversion">Inversion:</label>
              <input
                type="range"
                id="inversion"
                name="inversion"
                min="0"
                max="100"
                value={inversion}
                onChange={(e) => setInversion(e.target.value)}
              />
            </div>
            <div className="slider">
              <label htmlFor="borderRadius">Border Radius:</label>
              <input
                type="range"
                id="borderRadius"
                name="borderRadius"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
              />
            </div>
            <button onClick={downloadImage}>Download Image</button>
          </div>
          <div id="image-container">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) invert(${inversion}%)`,
                borderRadius: `${borderRadius}%`,
              }}
              onLoad={handleImageLoad}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
