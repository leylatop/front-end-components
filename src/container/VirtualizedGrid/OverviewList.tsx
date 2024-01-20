import React from "react";
import { AutoSizer, WindowScroller, List } from "react-virtualized";
import './style.css'

class OverviewList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { itemsPerRow: 4 };
  }

  render() {
    const { items, container } = this.props;
    console.log(items);
    return (
      <div>
        <div className="header-sticky">12345</div>
        <WindowScroller scrollElement={container}>
          {({ height, isScrolling, registerChild, scrollTop }) => {
            return (
              <AutoSizer disableHeight>
                {({ width }) => {
                  console.log(width);
                  let itemsPerRow = Math.max(
                    1,
                    Math.min(Math.round(width / 200), 4)
                  );
                  return (
                    <div ref={registerChild}>
                      <List
                        autoHeight
                        height={height}
                        isScrolling={isScrolling}
                        rowCount={1000 / itemsPerRow}
                        rowHeight={100}
                        rowRenderer={({ key, index, style }) => {
                          const fromIndex = index * itemsPerRow;
                          const toIndex = Math.min(
                            fromIndex + itemsPerRow,
                            items.length
                          );
                          let itemsToAdd = [];
                          console.log(fromIndex, toIndex);
                          for (let idx = fromIndex; idx < toIndex; idx++) {
                            const item = items[idx];
                            console.log(item);

                            itemsToAdd.push(
                              <div>
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
                        }}
                        scrollTop={scrollTop}
                        width={width}
                      />
                    </div>
                  );
                }}
              </AutoSizer>
            );
          }}
        </WindowScroller>
      </div>
    );
  }
}

export default OverviewList;
