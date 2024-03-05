import React from 'react';

export default function createListComponent({
  getItemSize,
  getEstimatedTotalSize,
  getItemOffset,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps
}) {
  return class extends React.Component {
    static defaultProps = {
      overScanCount: 2
    }

    constructor(props) {
      super(props);
      this.instanceProps = initInstanceProps && initInstanceProps(this.props)
      this.state = { scrollOffset: 0 }
      this.outerRef = React.createRef()
      this.oldFirstRef = React.createRef()
      this.oldLastRef = React.createRef()
      this.firstRef = React.createRef()
      this.lastRef = React.createRef()
      this.itemStyleCache = new Map()
    }

    componentDidMount() {
      this.observe(this.oldFirstRef.current = this.firstRef.current);
      this.observe(this.oldLastRef.current = this.lastRef.current);
    }
    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
      if (this.oldFirstRef.current !== this.firstRef.current) {
        this.oldFirstRef.current = this.firstRef.current;
        this.observe(this.firstRef.current);
      }
      if (this.oldLastRef.current !== this.lastRef.current) {
        this.oldLastRef.current = this.lastRef.current;
        this.observe(this.lastRef.current);
      }
    }
    observe = (dom) => {
      let io = new IntersectionObserver((entries) => {
        entries.forEach(this.onScroll);
      }, { root: this.outerRef.current })
      io.observe(dom);
    }
    render() {
      const { width, height, children: Row } = this.props;
      const containerStyle = { position: 'relative', width, height, overflow: 'auto', willChange: 'transform' };
      const contentStyle = {
        width: '100%',
        height: getEstimatedTotalSize(this.props, this.instanceProps)
      }
      const items = [];
      const [startIndex, stopIndex, originStartIndex, originStopIndex] = this._getRangeToRender()
      for (let index = startIndex; index <= stopIndex; index++) {
        const style = this._getItemStyle(index)
        if (index === originStartIndex) {
          items.push(<Row key={index} index={index} style={style} forwardRef={this.firstRef} />)
          continue;
        } else if (index === originStopIndex) {
          items.push(<Row key={index} index={index} style={style} forwardRef={this.lastRef} />)
          continue;
        }
        items.push(<Row key={index} index={index} style={style} />)
      }

      return (
        <div style={containerStyle} ref={this.outerRef}>
          <div style={contentStyle}>
            {items}
          </div>
        </div>
      )
    }

    onScroll = () => {
      const { scrollTop } = this.outerRef.current;
      this.setState({
        scrollOffset: scrollTop
      })
    }

    _getItemStyle = (index) => {
      let style
      if (this.itemStyleCache.has(index)) {
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
      const { scrollOffset } = this.state;
      const { itemCount, overScanCount } = this.props;
      const startIndex = getStartIndexForOffset(this.props, scrollOffset, this.instanceProps);
      const stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffset, this.instanceProps);
      return [
        Math.max(0, startIndex - overScanCount),
        Math.min(itemCount - 1, stopIndex + overScanCount),
        startIndex, stopIndex]
    }
  }
}