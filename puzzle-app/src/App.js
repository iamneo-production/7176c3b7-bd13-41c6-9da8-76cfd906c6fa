/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import React
, { useCallback, useEffect, useState }
  from 'react';
import ImageCrop from './ImageCrop';

function App() {
  const [rootSize, setRootSize] = useState();
  const [tiles, setTiles] = useState(undefined)
  const [imageSize, setImageSize] = useState()
  const [calculatedHeight, setCalculatedHeight] = useState(0);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [src, setSrc] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [imageName, setImageName] = useState("");


  const createImageList = (newImage) => {
    setCroppedImages((prev) => [...prev, newImage]);
  }

  const selectImage = (file) => {
    console.log(file);
    setImageName(file.name);
    setSrc(URL.createObjectURL(file));
    setCroppedImages([]);
  };

  const onImageLoaded = useCallback((image) => {
    setImageSize({ width: image.width, height: image.height })
    if (rootSize) { setCalculatedHeight(rootSize.width / image.width * image.height) }
    console.log(image.height, image.width, imageSize);
    setTiles(
      Array.from(Array(rows * columns).keys())
        .map(position => ({
          correctPosition: position,
          tileHeight: image.height / rows,
          tileWidth: image.width / columns,
          tileOffsetX: (position % columns) * (image.width / columns),
          tileOffsetY: Math.floor(position / columns) * (image.height / rows),
          currentPosXPerc: Math.random() * (1 - 1 / rows),
          currentPosYPerc: Math.random() * (1 - 1 / columns),
          solved: false,
          imageName: imageName
        }))
    )
  }, [rows, columns]);

  useEffect(() => {
    const image = new Image()
    image.onload = () => onImageLoaded(image)
    image.src = src
  }, [src]);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          selectImage(e.target.files[0]);
        }}
      />
      {tiles && tiles.map((tile) =>
        <ImageCrop src={src} tile={tile} createImageList={createImageList} imageName={imageName} />
      )}

      <div
        style={{ display: "flex", flexWrap: "wrap" }}
      >

        {croppedImages &&
          croppedImages.map((iName, i) =>
            <div
              draggable={false}
              key={tiles[i].correctPosition}
            >
              <img src={iName} alt='' className='imageClass' />
            </div>)}
      </div>
    </>
  );
}

export default App;
