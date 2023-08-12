/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import React
, { useCallback, useEffect, useState }
  from 'react';
import ImageCrop from './ImageCrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Example from './components/Example';
import { tileContext } from './context/tilesContext';

function App() {
  const [tiles, setTiles] = useState(undefined)
  const [src, setSrc] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [imageName, setImageName] = useState("");

  const [rows] = useState(3);
  const [columns] = useState(3);


  const createImageList = (newImage) => {
    setCroppedImages((prev) => [...prev, newImage]);
  }

  const selectImage = (file) => {
    setImageName(file.name);
    setSrc(URL.createObjectURL(file));
    setCroppedImages([]);
  };

  const onImageLoaded = useCallback((image) => {
    setTiles(
      Array.from(Array(rows * columns).keys())
        .map(position => ({
          correctPosition: position,
          accepts: [`${position}`],
          lastDroppedItem: null,
          tileHeight: image.height / rows,
          tileWidth: image.width / columns,
          tileOffsetX: (position % columns) * (image.width / columns),
          tileOffsetY: Math.floor(position / columns) * (image.height / rows),
          solved: false,
        }))
    )
  }, [rows, columns]);

  useEffect(() => {
    const image = new Image()
    image.onload = () => onImageLoaded(image)
    image.src = src
  }, [src]);

  return (
    <tileContext.Provider value={{ tiles, rows, columns, croppedImages }}>
      <div className='App'>
        <input type="file" accept="image/*" onChange={(e) => selectImage(e.target.files[0])} />
        <DndProvider backend={HTML5Backend}>
          <Example />
        </DndProvider>
        {tiles && tiles.map((tile) =>
          <ImageCrop key={tile.correctPosition} src={src} tile={tile} createImageList={createImageList} imageName={imageName} />
        )}
      </div>
    </tileContext.Provider>
  );
}

export default App;
