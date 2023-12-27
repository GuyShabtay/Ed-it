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
      
    </div>
    {image && (
      <div>
        <label>Border Radius:</label>
        <input
          type='range'
          min='0'
          max='100'
          value={borderRadius}
          onChange={handleBorderRadiusChange}
        />
        <div
          ref={imageRef}
          style={{
            borderRadius: `${borderRadius}px`,
            overflow: 'hidden',
          }}
        >
          <img src={image} alt='Edited' style={{ width: '100%' }} />
        </div>
        <button onClick={handleDownload}>Download Image</button>
      </div>
    )}
  </div>
)}









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

  const handleBorderRadiusChange = (e) => {
    setBorderRadius(parseInt(e.target.value, 10));
  };

  const handleDownload = () => {
    html2canvas(imageRef.current, { backgroundColor: null }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'edited_image.png';
      link.click();
    });
  };
