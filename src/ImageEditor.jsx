// import React, { useState, useRef, useCallback } from 'react';
// import html2canvas from 'html2canvas';
// import { useDropzone } from 'react-dropzone';
import { toPng } from "html-to-image";

// import './ImageEditor.css';

// const ImageEditor = () => {
//   const [image, setImage] = useState(null);
//   const [borderRadius, setBorderRadius] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [resultImage, setResultImage] = useState(null);
//   const [brightness, setBrightness] = useState(100);
//   const [contrast, setContrast] = useState(100);
//   const [sepia, setSepia] = useState(0);
//   const [grayscale, setGrayscale] = useState(0);
//   const [blur, setBlur] = useState(0);
//   const [hue, setHue] = useState(0);
//   const [saturation, setSaturation] = useState(100);
//   const [inversion, setInversion] = useState(0);
//   const [downloadPressed, setDownloadPressed] = useState(false);
//   const [rotate, setRotate] = useState(0);
//   const [flipX, setFlipX] = useState(1);
//   const [flipY, setFlipY] = useState(1);
//   const imageRef = useRef(null);
const [image, setImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const elementRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const htmlToImageConvert = () => {
    toPng(imageRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

//   const onDrop = useCallback((acceptedFiles) => {
//     setSelectedImage(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     noClick: true, // Disable click-to-select
//   });

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       setImage(reader.result);
//     };

//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   };
//   const rotateLeft = () => {
//     setRotate((rotate) => (rotate - 90 + 360) % 360);
//   };

//   const rotateRight = () => {
//     setRotate((rotate) => (rotate + 90) % 360);
//   };
//   const flipHorizontal = () => {
//     if (flipX===1)
//     setFlipX(-1);
//   else
//   setFlipX(1);
//   };
//   const flipVertical = () => {
//     if (flipY===1)
//     setFlipY(-1);
//   else
//   setFlipY(1);
//   };

//   const handleBorderRadiusChange = (e) => {
//     setBorderRadius(parseInt(e.target.value, 10));
//   };
//   // const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hue}deg) saturate(${saturation}%) invert(${inversion}%)`;

//   const handleDownload = () => {
//       html2canvas(imageRef.current, { backgroundColor: null }).then((canvas) => {
//         const imgData = canvas.toDataURL('image/png');
//         const link = document.createElement('a');
//         link.href = imgData;
//         link.download = 'edited_image.png';
//         link.click();
//       });
//     };

//   return (
//     <div>
//       {!selectedImage ? (
//         <div
//           className={!isDragActive ? 'drop-zone' : 'drop-zone active-drop-zone'}
//           {...getRootProps()}
//         >
//           <input
//             type='file'
//             id='file-input'
//             name='file-input'
//             onChange={handleImageChange}
//           />
//           <div className='drop-or-select'>
//             {!isDragActive ? (
//               <div>
//                 <label id='file-input-label' htmlFor='file-input'>
//                   Upload Image
//                 </label>
//                 <p>or drop a file</p>
//               </div>
//             ) : (
//               <h1>Drop image anywhere</h1>
//             )}
//           </div>
//           <input {...getInputProps()} />
//         </div>
//       ) : (
//         <div className='edit'>
//           <div className='sliders'>

//         <div className="slider">
//         <label>Border Radius:</label>
//         <input
//           type='range'
//           min='0'
//           max='50'
//           value={borderRadius}
//           onChange={(e) => setBorderRadius(e.target.value)}
//           />
//         </div>
//         <button onClick={rotateLeft} className='rotate-left'>Rotate Left</button>
//         <button onClick={rotateRight} className='rotate-right'>Rotate Right</button>
//         <button onClick={flipVertical} className='flip-vertical'>Flip Vertical</button>
//           <button onClick={flipHorizontal} className='flip-horizontal'>Flip Horizontal</button>

//         {rotate}
//           </div>

//             <div>

//               <div
//                 ref={imageRef}
//                 style={{
//                   borderRadius: `${borderRadius}%`,
//                   // transform: `rotate(${rotate}deg) scaleX(${flipX}) scaleY(${flipY})`,
//                   // transform: `perspective(50px) rotateY(-1deg)`,
//                   // transformOrigin: '50% 50%', // Set the rotation point to the center of the image
//                   width: '400px'  ,
//                   transform: 'perspective(130px) rotateY(-8deg)',

//                   overflow: 'hidden',

//                 }}
//               >
//               <img id='image' src={URL.createObjectURL(selectedImage)} alt='Edited'
//               style={{

//                 // width: '400px'  ,
//                 // transform: 'perspective(130px) rotateY(-8deg)',

//                 // overflow: 'hidden',

//               }} />
//               </div>
//               <button onClick={htmlToImageConvert}>Download Image</button>
//             </div>

//         </div>
//       )}
//     </div>
//   );
// };
// export default ImageEditor;
// import React, { createRef, useState } from 'react'






import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";

function ImageEditor() {
  const [image, setImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const elementRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const htmlToImageConvert = () => {
    toPng(imageRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleImageUpload} ref={imageInputRef} />
        <label>
          Border Radius:
          <input
            type="range"
            value={borderRadius}
            onChange={(e) => setBorderRadius(e.target.value)}
            min="0"
            max="50"
          />
          {borderRadius} px
        </label>
        <label>
          Brightness:
          <input
            type="range"
            value={brightness}
            onChange={(e) => setBrightness(e.target.value)}
            min="0"
            max="200"
          />
          {brightness} %
        </label>
      </div>
      <div
        ref={elementRef}
        style={{
          position: "relative",
          width: "100%",
          height: "300px",
          overflow: "hidden",
          borderRadius: `${borderRadius}px`,
        }}
      >
        {image && (
          <img
            src={image}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `brightness(${brightness}%)`,
            }}
          />
        )}
        {!image && (
          <h1
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              borderCollapse: "collapse",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0",
            }}
          >
            hello world
          </h1>
        )}
      </div>
      <button onClick={htmlToImageConvert}>Download Image</button>
    </div>
  );
}

export default ImageEditor;

