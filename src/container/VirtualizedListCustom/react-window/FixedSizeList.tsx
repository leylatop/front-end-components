import createListComponent from './createListComponent'

const FixedSizeList = createListComponent({
  getItemSize: ({ itemSize }) => itemSize,
  getEstimatedTotalSize: ({ itemCount, itemSize }) => itemCount * itemSize,
  getItemOffset: ({ itemSize }, index) => index * itemSize,
})

export default FixedSizeList
