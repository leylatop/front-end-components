import React, { useState } from "react";
import { FixedSizeList as List } from "react-window";
// import { List } from "react-virtualized";



const VirtualizedList = () => {
  const [data, setData] = useState(() =>
    Array.from({ length: 10000 }, (_, i) => i)
  );
  const reverse = () => {
    setData((data) => data.slice().reverse());
  };

  return (
    <main>
      <button onClick={reverse}>Reverse</button>
      <List
        innerElementType="ul"
        itemCount={data.length}
        itemSize={20}
        height={800}
        width={400}
      >
        {({ index, style }) => {
          return (
            <li style={style}>
              {data[index]}
            </li>
          );
        }}
      </List>
    </main>
  );
};

export {
  VirtualizedList
}