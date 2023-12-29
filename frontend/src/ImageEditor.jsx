import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toPng } from 'html-to-image';
import Button from '@mui/material/Button';
import FlipIcon from '@mui/icons-material/Flip';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import DownloadingIcon from '@mui/icons-material/Downloading';
import WallpaperSharpIcon from '@mui/icons-material/WallpaperSharp';
import axios from 'axios';
import './ImageEditor.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LoadingSpinner from './assetes/LoadingSpinner/LoadingSpinner';
import ImageViewer from './ImageViewer'; // Replace with the actual path to your ImageViewer file


  

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const imageRef = useRef(null);
  const [outputImage, setOutputImage] = useState(null);
  const [withBg, setWithBg] = useState(true);
  const [showRadioBtns, setShowRadioBtns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSize, setImageSize] = useState('');

  const handleChange = (event) => {
    setImageSize(event.target.value);
  };

  const handleDownloadOutput = async () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = outputImage;
    downloadLink.download = 'output_image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleProcessImage = async () => {
    setIsLoading(true);
    try {
      if (imageRef.current) {
        const dataUrl = await toPng(imageRef.current, { cacheBust: false });
        const response = await axios.post(
          'http://127.0.0.1:5000/api/remove-background',
          {
            imageData: dataUrl.split(',')[1],
          }
        );
        setOutputImage(
          `data:image/png;base64,${response.data.outputImageData}`
        );
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
    setIsLoading(false);

  };

  useEffect(() => {
    if (imageRef.current) {
    }
  }, [imageRef]);

  const htmlToImageConvert = () => {
    // setImageSize(100)
    toPng(imageRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
      // setImageSize(500)

  };

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
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
    setRotate((rotate) => (rotate - 90));
  };

  const rotateRight = () => {
    setRotate((rotate) => (rotate + 90));
  };
  const flipHorizontal = () => {
    if (flipX === 1) setFlipX(-1);
    else setFlipX(1);
  };
  const flipVertical = () => {
    if (flipY === 1) setFlipY(-1);
    else setFlipY(1);
  };

  return (
    <div>
      {!selectedImage ? (
        <div className='drop-zone' {...getRootProps()}>
          <div className={!image ? 'main-component' : 'main-component edit'}>
            <h1>ED-IT!</h1>
            <input
              type='file'
              id='file-input'
              name='file-input'
              onChange={handleImageChange}
            />
            <div className='drop-or-select'>
              <div>
                <label id='file-input-label' htmlFor='file-input'>
                  Upload Image
                </label>
                <p>or drop a file</p>
              </div>
            </div>

            {isDragActive && (
              <div>
                <input {...getInputProps()} />
                <div className='layer'>
                  <h1>Drop image anywhere</h1>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='edit-container'>
          <h1>ED-IT!</h1>

          <div className='edit'>
            <div className='sliders'>
              <div className='slider'>
                <label htmlFor='brightness'>Brightness:</label>
                <input
                  type='range'
                  id='brightness'
                  name='brightness'
                  min='0'
                  max='200'
                  value={brightness}
                  onChange={(e) => setBrightness(e.target.value)}
                />
              </div>
              <div className='slider'>
                <label htmlFor='contrast'>Contrast:</label>
                <input
                  type='range'
                  id='contrast'
                  name='contrast'
                  min='0'
                  max='200'
                  value={contrast}
                  onChange={(e) => setContrast(e.target.value)}
                />
              </div>
              <div className='slider'>
                <label htmlFor='sepia'>Sepia:</label>
                <input
                  type='range'
                  id='sepia'
                  name='sepia'
                  min='0'
                  max='100'
                  value={sepia}
                  onChange={(e) => setSepia(e.target.value)}
                />
              </div>
              <div className='slider'>
                <label htmlFor='grayscale'>Grayscale:</label>
                <input
                  type='range'
                  id='grayscale'
                  name='grayscale'
                  min='0'
                  max='100'
                  value={grayscale}
                  onChange={(e) => setGrayscale(e.target.value)}
                />
              </div>
              <div className='slider'>
                <label htmlFor='blur'>Blur:</label>
                <input
                  type='range'
                  id='blur'
                  name='blur'
                  min='0'
                  max='10'
                  step='0.1'
                  value={blur}
                  onChange={(e) => setBlur(e.target.value)}
                />
              </div>
              <div className='slider'>
                <label htmlFor='hue'>Hue:</label>
                <input
                  type='range'
                  id='hue'
                  name='hue'
                  min='0'
                  max='360'
                  value={hue}
                  onChange={(e) => setHue(e.target.value)}
                />
              </div>
              <div className='slider'>
                <label htmlFor='saturation'>Saturation:</label>
                <input
                  type='range'
                  id='saturation'
                  name='saturation'
                  min='0'
                  max='200'
                  value={saturation}
                  onChange={(e) => setSaturation(e.target.value)}
                />
              </div>
              <div className='slider'>
                <label htmlFor='inversion'>Inversion:</label>
                <input
                  type='range'
                  id='inversion'
                  name='inversion'
                  min='0'
                  max='100'
                  value={inversion}
                  onChange={(e) => setInversion(e.target.value)}
                  />
              </div>

              <div className='slider'>
                <label>Border Radius:</label>
                <input
                  type='range'
                  min='0'
                  max='50'
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}

                  
                />
              </div>

              <Button
                onClick={flipHorizontal}
                startIcon={<FlipIcon className='icon horizontal' />}
              ></Button>
              <Button
                onClick={flipVertical}
                startIcon={<FlipIcon className='icon vertical' />}
              ></Button>
              <Button
                onClick={rotateRight}
                startIcon={<RotateRightIcon className='icon' />}
              ></Button>
              <Button
                onClick={rotateLeft}
                startIcon={<RotateLeftIcon className='icon' />}
              ></Button>

              <Button
                className='remove-bg'
                onClick={() => {
                  handleProcessImage();
                  setShowRadioBtns(true);
                }}
                startIcon={<WallpaperSharpIcon />}
              >
                Remove Background
              </Button>
             
              <Button
                onClick={htmlToImageConvert}
                startIcon={<DownloadingIcon />}
              >
                Download Image
              </Button>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Image Size</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={imageSize}
                label="Image Size"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={50}>Tiny</MenuItem>
                <MenuItem value={200}>Very small</MenuItem>
                <MenuItem value={400}>Small</MenuItem>
                <MenuItem value={600}>Normal</MenuItem>
                <MenuItem value={700}>Big</MenuItem>
                <MenuItem value={800}>Very Big</MenuItem>
                <MenuItem value={900}>Giant</MenuItem>
              </Select>
            </FormControl>
       
            </div>
            <div>
              <div className='images'>
               
                <div
                  ref={imageRef}
                  style={{
                    height:`${imageSize}px`,
                  width:'auto',
                    borderRadius: `${borderRadius}%`,
                    transform: `rotate(${rotate}deg) scaleX(${flipX}) scaleY(${flipY})`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) invert(${inversion}%)`,
                    overflow: 'hidden',
                    transition: '0.5s transform ease-in-out'
                    
                  }}
                >
                  <img
                    id='image'
                    src={URL.createObjectURL(selectedImage)}
                    alt='Edited' style={{
                      height:`${imageSize}px`,
                      width:'auto',
                    }}
                  />
                </div>
              </div>
              {(outputImage || isLoading) &&
                <div className="layer overlay">
                <div className="output-image-container">
                {isLoading && <LoadingSpinner /> }
                 {outputImage &&<img src={outputImage} id='output-image' alt='Output Image' style={{
                  height:`${imageSize}px`,
                  width:'auto',
                }} />}
                 <div>
                 <Button
                 className='cancel'
                 onClick={() => setOutputImage(null)}
                 startIcon={<CancelOutlinedIcon />}
               >
                 Cancel
               </Button>
                 <Button
                 onClick={handleDownloadOutput}
                 startIcon={<DownloadingIcon />}
               >
                 Download Image
               </Button>
               </div>
                 </div>
                 </div>
                }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageEditor;
