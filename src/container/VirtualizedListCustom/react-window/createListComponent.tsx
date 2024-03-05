import React from 'react';

export default function createListComponent({
  getItemSize,
  getEstimatedTotalSize,
  getItemOffset
}) {
  return class extends React.Component {
    render() {
      const { width, height, itemCount, children: ComponentType} = this.props;
      const containerStyle = { position: 'relative', width, height, overflow: 'auto', willChange: 'transform' };
      const contentStyle = {
        height: getEstimatedTotalSize(this.props),
        width: '100%'
      }
      const items = [];
      if(itemCount > 0) {
        for(let index = 0; index < itemCount; index++) {
          items.push(
            <ComponentType key={index} index={index} style={this._getItemStyle(index)}/>
          )
        }
      }

      return (
        <div style={containerStyle}>
          <div style={contentStyle}>
            {items}
          </div>
        </div>
      )
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
  }
}