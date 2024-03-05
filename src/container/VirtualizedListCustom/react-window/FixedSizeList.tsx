import createListComponent from './createListComponent'

const FixedSizeList = createListComponent({
  getItemSize: ({ itemSize }) => itemSize,
  getEstimatedTotalSize: ({ itemCount, itemSize }) => itemCount * itemSize,
  getItemOffset: ({ itemSize }, index) => index * itemSize,
  getStartIndexForOffset: ({ itemSize }, offset) => Math.floor(offset/itemSize), // 获得开始索引
  getStopIndexForStartIndex: ({ height, itemSize}, startIndex) => {
    const numVisibleItems = Math.ceil(height / itemSize)
    return startIndex + numVisibleItems - 1
  }, // 获得结束索引
  getOffsetForIndex: ({ itemSize }, index) => index * itemSize,
})

export default FixedSizeList
