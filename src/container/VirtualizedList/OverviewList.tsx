import React from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import './style.css'

class OverviewList extends React.PureComponent {
  render() {
    const { items } = this.props;
    return <AutoSizer>
      {({ width, height = 0 }) => {
        return <List
        itemCount={items.length}
        itemSize={50}
        height={height}
        width={width}
        >
          {({ index, style }) => {
          return (
            <div style={style}>
              {items[index].name}
              {items[index].email}
            </div>
          );
        }}
        </List>
      }}
    </AutoSizer>
  }
}

export default OverviewList;
