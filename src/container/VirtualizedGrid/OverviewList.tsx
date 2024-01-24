import React from "react";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import './style.css'

class OverviewList extends React.PureComponent {
  Row = ({ key, index, style, width }) => {
    const { items } = this.props;
    const itemsPerRow = Math.max(1, Math.floor(width / (158 + 14)));

    const fromIndex = index * itemsPerRow;
    const toIndex = Math.min(
      fromIndex + itemsPerRow,
      items.length
    );
    const itemsToAdd = [];
    for (let idx = fromIndex; idx < toIndex; idx++) {
      const item = items[idx];
      itemsToAdd.push(
        <div className="grid-item">
          {index * itemsPerRow + (idx % itemsPerRow)} -{" "}
          {item.name}
        </div>
      );
    }

    return (
      <div className={"list-row"} key={key} style={style}>
        {itemsToAdd}
      </div>
    );
  }

  render() {
    const { items } = this.props;
    const Row = this.Row;
    return <AutoSizer>
      {({ width, height = 0 }) => {
        const itemsPerRow = Math.max(1, Math.floor(width / (158 + 14)));
        return <List
          height={height}
          itemCount={Math.ceil(items.length / itemsPerRow)}
          itemSize={100}
          width={width}
        >
          {(props) => {
            return <Row {...props} width={width} height={height}/>
          }}
        </List>
      }}
    </AutoSizer>
  }
}

export default OverviewList;
