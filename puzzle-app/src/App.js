/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Example from './components/Example';
import { tileContext } from './context/tilesContext';
import { addCroppedImage, getAllCroppedImages } from './utils/databaseUtils';
import ImageCrops from './components/ImageCrops';
import { API_URL } from './utils/constants';
import useFetch from './utils/useFetch';

function App() {
  const [tiles, setTiles] = useState(undefined)
  const [src, setSrc] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [imageName, setImageName] = useState("");

  const [rows] = useState(4);
  const [columns] = useState(4);
  // const url = `${API_URL}/puzzle`;

  // const puzzle = getAllCroppedImages(url);
  // console.log(puzzle);

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
    image.onload = () => onImageLoaded(image);
    image.src = src
  }, [src]);

  // useEffect(() => {
  //   if(croppedImages) {
  //     const url = `${API_URL}/puzzle`;
  //     let postData = {
  //       images: croppedImages,
  //       position: tiles
  //     }
  //   }
  // }, [croppedImages]);

  return (
    <tileContext.Provider value={{ tiles, rows, columns, croppedImages }}>
      <div className='App'>
        <input type="file" accept="image/*" onChange={(e) => selectImage(e.target.files[0])} />
        <DndProvider backend={HTML5Backend}>
          <Example />
        </DndProvider>
        <ImageCrops src={src} setCroppedImages={setCroppedImages} imageName={imageName} />
      </div>
    </tileContext.Provider>
  );
}

export default App;