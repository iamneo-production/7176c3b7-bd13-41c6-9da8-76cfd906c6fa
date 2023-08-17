import React, { useContext, useEffect, useState } from 'react'
import ImageCrop from '../ImageCrop'
import { tileContext } from '../context/tilesContext';

function ImageCrops({ src, setCroppedImages, imageName }) {
    const { tiles = [] } = useContext(tileContext);
    const [images, setImages] = useState([]);

    const createImageList = (newImage) => {
        setImages((prev) => [...prev, newImage]);
    }

    useEffect(() => {
        setCroppedImages(images);
    }, [images]);

    return <>
        {tiles?.map((tile) =>
            <ImageCrop
                key={tile.correctPosition}
                src={src}
                tile={tile}
                createImageList={createImageList}
                imageName={imageName}
            />
        )}
    </>
}

export default ImageCrops;