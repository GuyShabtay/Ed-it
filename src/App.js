import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const apiKey = process.env.API_KEY;

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(acceptedFiles[0]);
  }, []);

  
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          width: '700px',
          height: '700px',
          border: '2px solid purple',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          marginBottom: '20px',
        }}
      >
        <input {...getInputProps()} />
        Drag and drop image here or click to select
      </div>
      <button onClick={removeBackground}>Remove Background</button>
      {resultImage && <img src={resultImage} alt="Result" />}
    </div>
  );
};

export default App;
