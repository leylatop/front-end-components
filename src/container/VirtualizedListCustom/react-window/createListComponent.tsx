import React from 'react';

export default function createListComponent({
  getItemSize,
  getEstimatedTotalSize,
  getItemOffset,
  getStartIndexForOffset,
  getStopIndexForStartIndex
}) {
  return class extends React.Component {
    static defaultProps = {
      overScanCount: 2
    }
    state = {
      scrollOffset: 0,
    }
    render() {
      const { width, height, itemCount, children: ComponentType} = this.props;
      const containerStyle = { position: 'relative', width, height, overflow: 'auto', willChange: 'transform' };
      const contentStyle = {
        height: getEstimatedTotalSize(this.props),
        width: '100%'
      }
      const items = [];
      if(itemCount > 0) {
        const [startIndex, stopIndex] = this._getRangeToRender()
        for(let index = startIndex; index <= stopIndex; index++) {
          items.push(
            <ComponentType key={index} index={index} style={this._getItemStyle(index)}/>
          )
        }
      }

      return (
        <div style={containerStyle} onScroll={this.onScroll}>
          <div style={contentStyle}>
            {items}
          </div>
        </div>
      )
    }

    onScroll = (event) => {
      const { scrollTop } = event.target;
      this.setState({
        scrollOffset: scrollTop
      })
    }

    _getItemStyle=(index) => {
      const style = {
        position: 'absolute',
        width: '100%',
        height: getItemSize(this.props, index),
        top: getItemOffset(this.props, index)
      }
      return style
    }

    _getRangeToRender = () => {
      const {scrollOffset} = this.state;
      const {itemCount, overScanCount} = this.props;
      const startIndex = getStartIndexForOffset(this.props, scrollOffset);
      const stopIndex = getStopIndexForStartIndex(this.props, startIndex);
      return [
        Math.max(0, startIndex - overScanCount),
        Math.min(itemCount - 1, stopIndex + overScanCount)
      ]
      // return [startIndex, stopIndex];
    }
  }
}