import React from "react";
import { AutoSizer, WindowScroller, List } from "react-virtualized";
// import { FixedSizeList as List } from "react-window";
import './style.css'

class OverviewList extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    console.log('---------componentDidMount')
    this.props.container.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount(): void {
    console.log('---------componentWillUnmount')
    this.props.container.removeEventListener('scroll', this.onScroll)
  }

  onScroll = (e) => {
    // console.log('---------onScroll', e.target.scrollTop, e.target.clientHeight)

  }

  render() {
    const { items, container } = this.props;
    return (
        <WindowScroller scrollElement={container}>
          {({ height, isScrolling, registerChild, scrollTop }) => {
            // console.log('---------scroll', height, scrollTop)
            return (
              <AutoSizer disableHeight>
                {({ width, height: hhhhhhh }) => {
                  console.log('---------scroll', width, hhhhhhh)
                  // 每个item宽度为158
                  const itemsPerRow = Math.max(1, Math.floor(width / (158 + 14)));
                  return (
                    // <div>
                      <List
                        autoHeight
                        height={height}
                        // isScrolling={isScrolling}
                        rowCount={1000 / itemsPerRow}
                        rowHeight={100}
                        rowRenderer={({ key, index, style }) => {
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
                        }}
                        scrollTop={scrollTop}
                        width={width}
                      />
                    // </div>
                  );
                }}
              </AutoSizer>
            );
          }}
        </WindowScroller>

    );
  }
}

export default OverviewList;
