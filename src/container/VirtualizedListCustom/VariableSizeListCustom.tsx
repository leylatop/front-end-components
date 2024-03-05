import React from 'react';
import { VariableSizeList } from './react-window';
import './VariableSizeListCustom.css';

const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50))

const getItemSize = index => rowSizes[index]

const Row = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven' } style={style}>
    Row {index}
  </div>
);

const VariableSizeListCustom = () => {
  const listRef = React.useRef(null);

  return (
    <>
    <button onClick={() => listRef.current.scrollToItem(500)}>Scroll to item 500</button>
    <VariableSizeList
      className="List"
      height={200}
      width={200}
      itemCount={1000}
      itemSize={getItemSize}
      ref={listRef}
    >
      {Row}
    </VariableSizeList>
    </>
  )
}

export {
  VariableSizeListCustom
}