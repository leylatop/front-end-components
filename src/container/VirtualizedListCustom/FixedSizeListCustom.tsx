import { FixedSizeList } from './react-window';
import './FixedSizeListCustom.css';
import React from 'react';
const Row = ({ index, style, isScrolling }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven' } style={style}>
    {
      isScrolling ? 'Scrolling' : `Row ${index}`
    }
  </div>
);
const FixedSizeListCustom = () => {
  const listRef = React.useRef(null);
  return (
    <>
      <button onClick={() => listRef.current.scrollToItem(500)}>Scroll to item 500</button>
      <FixedSizeList
      className="List"
      height={200}
      width={200}
      itemCount={1000}
      itemSize={50}
      useIsScrolling
      ref={listRef}
    >
      {Row}
    </FixedSizeList>
    </>
  )
}


export {
  FixedSizeListCustom
}