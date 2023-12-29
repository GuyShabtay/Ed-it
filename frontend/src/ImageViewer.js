// In a new file, e.g., ImageViewer.js
import React from 'react';

const ImageViewer = ({ imageUrl, imageSize }) => {
  return (
    <div
      style={{
        height: `${imageSize}px`,
        width: 'auto',
        overflow: 'hidden',
      }}
    >
      <img src={imageUrl} alt='View' style={{ height: `${imageSize}px`, width: 'auto' }} />
    </div>
  );
};

export default ImageViewer;
