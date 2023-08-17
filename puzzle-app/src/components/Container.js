import update from 'immutability-helper';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { ImageTile } from './ImageTile.js';
import { tileContext } from '../context/tilesContext.js';
import { Box } from './Box.js';

export const Container = memo(function Container() {
    const context = useContext(tileContext) || {};
    const { tiles, columns, rows, croppedImages } = context || {};

    const [imageTiles, setimageTiles] = useState(tiles);
    const [imageSize, setImageSize] = useState({ height: 0, width: 0 });
    const [droppedBoxNames, setDroppedBoxNames] = useState([]);
    const [boxes, setBoxes] = useState([])

    useEffect(() => {
        if (tiles !== undefined) {
            setimageTiles(tiles);
            setImageSize({ height: tiles[0]?.tileHeight * columns, width: tiles[0]?.tileWidth * rows })

            const cropedBoxes = tiles.map((tileVal, i) => {
                return { image: croppedImages[i], type: tileVal.accepts[0] };
            });
            setBoxes(cropedBoxes);
        }

    }, [tiles, croppedImages]);

    const isDropped = (boxName) => droppedBoxNames.indexOf(boxName) > -1;

    const handleDrop = useCallback(
        (index, item) => {
            const { name } = item
            setDroppedBoxNames(
                update(droppedBoxNames, name ? { $push: [name] } : { $push: [] }),
            )
            setimageTiles(
                update(imageTiles, {
                    [index]: {
                        lastDroppedItem: {
                            $set: item,
                        },
                    },
                }),
            )
        },
        [droppedBoxNames, imageTiles],
    );

    return (
        <div className='hide-pointer'>
            {imageSize && imageTiles &&
                <div className="tile-style" style={{
                    height: `${imageSize?.height + rows}px`, width: `${imageSize?.width + columns}px`
                }}>
                    {imageTiles?.map(({ accepts, lastDroppedItem, tileHeight, tileWidth }, index) => (
                        <ImageTile
                            accept={accepts}
                            lastDroppedItem={lastDroppedItem}
                            onDrop={(item) => handleDrop(index, item)}
                            height={tileHeight}
                            width={tileWidth}
                            key={index}
                        />
                    ))}
                </div>
            }

            <div style={{ overflow: 'hidden', clear: 'both' }}>
                {boxes.map(({ image, type }, index) => (
                    <Box
                        name={image}
                        type={type}
                        isDropped={isDropped(image)}
                        key={type}
                    />
                ))}
            </div>
        </div>
    )
})
