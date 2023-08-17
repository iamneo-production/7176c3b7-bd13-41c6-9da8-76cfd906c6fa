import { memo } from "react";
import { useDrop } from "react-dnd";

export const ImageTile = memo(function ImageTile({
  accept,
  lastDroppedItem,
  onDrop,
  height,
  width
}) {
    const style = {
        height: `${height}px`,
        width: `${width}px`,
        marginRight: "1px",
        marginBottom: "1px",
        color: "white",
        textAlign: "center",
        fontSize: "1rem",
        lineHeight: "normal",
        float: "left"
      };
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      // isOver: monitor.isOver(),
      // canDrop: monitor.canDrop()
    })
  });
  const isActive = isOver && canDrop;
  let backgroundColor = "#222";
  if (isActive || canDrop) {
    backgroundColor = "#222";
  }
  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="ImageTile">
      {!lastDroppedItem && 1}
      {lastDroppedItem && (
        <img src={lastDroppedItem.name} alt="" height="100%" width="100%"/>
      )}
    </div>
  );
});
