import createListComponent from './createListComponent'

const DEFAULT_ESTIMATED_ITEM_SIZE = 50
const getEstimatedTotalSize = () => {}

const VariableSizeList = createListComponent({
  getEstimatedTotalSize,
  getStartIndexForOffset: () => 0,
  getStopIndexForStartIndex: () => 0,
  getItemSize: () => 0,
  getItemOffset: () => 0,
  initInstanceProps: (props) => {
    const { estimatedItemSize } = props
    const instanceProps = {
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE
    }
    return instanceProps
  }
})

export default VariableSizeList
