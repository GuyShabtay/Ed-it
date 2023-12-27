import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
  const [downloadPressed, setDownloadPressed] = useState(false);
  const [rotate, setRotate] = useState(0);

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
        if (isEven(rotate / 90)) {

        canvas.width = img.width;
      canvas.height = img.height;
        }
        else{
          canvas.width = img.height;
      canvas.height = img.width;
        }

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) invert(${inversion}%)`;

      // Rotate the canvas
      ctx.rotate(rotate * Math.PI / 180);

      // Draw the image on the canvas
      // ctx.drawImage(img, 0, -canvas.width);
      ctx.drawImage(img,0, -canvas.width);


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
  const rotateLeft = () => {
    setRotate((rotate) => rotate - 90);
  };

  const rotateRight = () => {
    setRotate((rotate) => rotate + 90);
  };

  const flipVertical = () => {
    setSaturation((prevSaturation) => -prevSaturation);
  };

  const flipHorizontal = () => {
    setInversion((prevInversion) => (prevInversion === 100 ? 0 : 100));
  };
  function isEven(number) {
    if (number % 2 === 0) {
      return true;
    } else {
      return false;
    }
  }
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
            <button onClick={downloadImage}>Download Image</button>
            <button onClick={rotateLeft} className='rotate-left'>Rotate Left</button>
            <button onClick={rotateRight} className='rotate-right'>Rotate Right</button>
            <button onClick={flipVertical} className='flip-vertical'>Flip Vertical</button>
            <button onClick={flipHorizontal} className='flip-horizontal'>Flip Horizontal</button>
            {rotate}
          </div>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected Image"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) invert(${inversion}%)`,
              transform:`rotate(${rotate}deg)`,
            }}
            onLoad={handleImageLoad}
          />
        </div>
      )}
    </div>
  );
};

export default App;
