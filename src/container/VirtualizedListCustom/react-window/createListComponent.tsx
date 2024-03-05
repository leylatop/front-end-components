import React from 'react';
import { requestTimeout, cancelTimeout } from './timer'
const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
    this.resizeObserver = null
  }
  componentDidMount(): void {
    if (this.domRef.current) {
      const node = this.domRef.current.firstChild
      const { index, onSizeChange } = this.props
      this.resizeObserver = new ResizeObserver(() => {
        onSizeChange(index, node)
      })
      this.resizeObserver.observe(node)
    }
  }
  componentWillUnmount(): void {
    if (this.resizeObserver && this.domRef.current.firstChild) {
      this.resizeObserver.unobserve(this.domRef.current.firstChild);
    }
  }
  render() {
    const { index, style, ComponentType } = this.props

    return (
      <div className='item' style={style} ref={this.domRef}>
        <ComponentType index={index} />
      </div>
    )
  }
}

export default function createListComponent({
  getItemSize,
  getEstimatedTotalSize,
  getItemOffset,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps
}) {
  return class extends React.Component {
    itemStyleCache = new Map()
    instanceProps = initInstanceProps &&initInstanceProps(this.props)
    static defaultProps = {
      overScanCount: 2,
      useIsScrolling: false
    }
    state = {
      scrollOffset: 0,
      isScrolling: false
    }

    onSizeChange = (index, node) => {
      const height = node.offsetHeight;
      const { itemMetadataMap, lastMeasuredIndex } = this.instanceProps;
      const itemMetadata = itemMetadataMap[index];
      itemMetadata.size = height;
      let offset = 0;
      for(let i = 0; i <= lastMeasuredIndex; i++) {
        const itemMetadata = itemMetadataMap[i];
        itemMetadata.offset = offset;
        offset += itemMetadata.size;
      }
      this.itemStyleCache.clear();
      this.forceUpdate();
    }
    render() {
      const { width, height, itemCount, children: ComponentType, isDynamic, useIsScrolling } = this.props;
      const { isScrolling } = this.state;
      const containerStyle = { position: 'relative', width, height, overflow: 'auto', willChange: 'transform' };
      const contentStyle = {
        height: getEstimatedTotalSize(this.props, this.instanceProps),
        width: '100%'
      }
      const items = [];
      if(itemCount > 0) {
        const [startIndex, stopIndex] = this._getRangeToRender()
        for(let index = startIndex; index <= stopIndex; index++) {
          if(isDynamic) {
            items.push(
              <ListItem
                key={index}
                index={index}
                style={this._getItemStyle(index)}
                onSizeChange={this.onSizeChange}
                ComponentType={ComponentType}
                isScrolling={useIsScrolling ? isScrolling : undefined}
              />
            )
          } else {
            items.push(
              <ComponentType key={index} index={index} style={this._getItemStyle(index)} isScrolling={useIsScrolling ? isScrolling : undefined}/>
            )
          }
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
        scrollOffset: scrollTop,
        isScrolling: true
      }, this._resetIsScrollingDebounced)
    }

    _resetIsScrollingDebounced = () => {
      if(this._resetIsScrollingTimeoutId) {
        cancelTimeout(this._resetIsScrollingTimeoutId)
      }
      this._resetIsScrollingTimeoutId = requestTimeout(this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL)
    }

    _resetIsScrolling = () => {
      this._resetIsScrollingTimeoutId = null
      this.setState({
        isScrolling: false
      })
    }

    _getItemStyle=(index) => {
      let style
      if(this.itemStyleCache.has(index)) {
        style = this.itemStyleCache.get(index)
      } else {
        style = {
          position: 'absolute',
          width: '100%',
          height: getItemSize(this.props, index, this.instanceProps),
          top: getItemOffset(this.props, index, this.instanceProps)
        }
        this.itemStyleCache.set(index, style)
      }
      return style
    }

    _getRangeToRender = () => {
      const {scrollOffset} = this.state;
      const {itemCount, overScanCount} = this.props;
      const startIndex = getStartIndexForOffset(this.props, scrollOffset, this.instanceProps);
      const stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffset, this.instanceProps);
      return [
        Math.max(0, startIndex - overScanCount),
        Math.min(itemCount - 1, stopIndex + overScanCount)
      ]
      // return [startIndex, stopIndex];
    }
  }
}