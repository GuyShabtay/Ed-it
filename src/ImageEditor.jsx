import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useDropzone } from 'react-dropzone';
import './ImageEditor.css';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(0);
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
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const imageRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Disable click-to-select
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const rotateLeft = () => {
    setRotate((rotate) => (rotate - 90 + 360) % 360);
  };
  
  const rotateRight = () => {
    setRotate((rotate) => (rotate + 90) % 360);
  };
  const flipHorizontal = () => {
    if (flipX===1)
    setFlipX(-1);
  else
  setFlipX(1);
  };
  const flipVertical = () => {
    if (flipY===1)
    setFlipY(-1);
  else
  setFlipY(1);
  };

  const handleBorderRadiusChange = (e) => {
    setBorderRadius(parseInt(e.target.value, 10));
  };
  // const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) invert(${inversion}%)`;

  
  const handleDownload = () => {
      html2canvas(imageRef.current, { backgroundColor: null }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'edited_image.png';
        link.click();
      });
    };

  

  return (
    <div>
      {!selectedImage ? (
        <div
          className={!isDragActive ? 'drop-zone' : 'drop-zone active-drop-zone'}
          {...getRootProps()}
        >
          <input
            type='file'
            id='file-input'
            name='file-input'
            onChange={handleImageChange}
          />
          <div className='drop-or-select'>
            {!isDragActive ? (
              <div>
                <label id='file-input-label' htmlFor='file-input'>
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
        <div className='edit'>
          <div className='sliders'>
          
        <div className="slider">
        <label>Border Radius:</label>
        <input
          type='range'
          min='0'
          max='50'
          value={borderRadius}
          onChange={(e) => setBorderRadius(e.target.value)}
          />
        </div>
        <button onClick={rotateLeft} className='rotate-left'>Rotate Left</button>
        <button onClick={rotateRight} className='rotate-right'>Rotate Right</button>
        <button onClick={flipVertical} className='flip-vertical'>Flip Vertical</button>
          <button onClick={flipHorizontal} className='flip-horizontal'>Flip Horizontal</button>
        
        {rotate}
          </div>
          
            <div>
             
              <div
                ref={imageRef}
                style={{
                  borderRadius: `${borderRadius}%`,
                  // transform: `rotate(${rotate}deg) scaleX(${flipX}) scaleY(${flipY})`,
                  transform: `perspective(130px) rotateY(-8deg) translateZ(0)`,
                  transformOrigin: '50% 50%', // Set the rotation point to the center of the image


                  overflow: 'hidden',

                }}
              >
              <img id='image' src={URL.createObjectURL(selectedImage)} alt='Edited' />
              </div>
              <button onClick={handleDownload}>Download Image</button>
            </div>
         
        </div>
      )}
    </div>
  );
};
export default ImageEditor;
