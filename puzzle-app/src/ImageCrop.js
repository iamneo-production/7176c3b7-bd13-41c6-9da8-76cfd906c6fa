import React, { useCallback, useEffect, useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { addCroppedImage } from './utils/databaseUtils';
import { API_URL } from './utils/constants';
import useFetch from './utils/useFetch';

function ImageCrop(props) {
    const { src, tile, createImageList
    } = props || {};
    const { tileHeight, tileWidth, tileOffsetX, tileOffsetY
    } = tile || {};

    const [crop, setCrop] = useState({
        unit: "px",
        x: tileOffsetX,
        y: tileOffsetY,
        width: tileWidth,
        height: tileHeight
    });
    const [image, setImage] = useState(null);
    const [output, setOutput] = useState(null);
    const [response, requestCall] = useFetch();

    const saveImage = () => {
        let url = `${API_URL}/puzzle`;
        const body = {
            image: output,
            detail: {
                position: tile.correctPosition,
                x: tileOffsetX,
                y: tileOffsetY,
                height: tileHeight,
                with: tileWidth
            },
        }
        requestCall(url, "POST", body);
    }

    const cropImageNow = useCallback(() => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(image, crop.x, crop.y, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);

        // Converting to base64
        const base64Image = canvas.toDataURL('image/jpeg');
        setOutput(base64Image);

        /**
         * code for Download Images for save in folder
         */
        // const downloadLink = document.createElement("a");
        // downloadLink.href = base64Image;
        // downloadLink.download = `${correctPosition}-${imageName}`;
        // downloadLink.click();
    }, [crop.height, crop.width, crop.x, crop.y, image]);


    useEffect(() => {
        if (image?.src) {
            cropImageNow();
        }
    }, [cropImageNow, image]);

    useEffect(() => {
        if (output) {
            saveImage();
            createImageList(output);
        }
    }, [output]);

    function onImageLoad(e) {
        const crop = {
            unit: "px",
            x: tileOffsetX,
            y: tileOffsetY,
            width: tileWidth,
            height: tileHeight
        };
        setCrop(crop);
        setImage(e.target);
    }

    const onCropChange = (crop) => {
        setCrop(crop)
    }

    return (
        <div className="App">
            {src && (
                <div>
                    <ReactCrop crop={crop} onChange={onCropChange} 
                    // onComplete={cropImageNow} 
                    >
                        <img src={src} alt='' onLoad={onImageLoad} style={{ display: "none" }} />
                    </ReactCrop>
                </div>
            )}
        </div>
    );
}

export default ImageCrop