import createListComponent from './createListComponent'

const DEFAULT_ESTIMATED_ITEM_SIZE = 50
const getEstimatedTotalSize = ({ itemCount }, { estimatedItemSize }) => {
  const numUnmeasuredItems = itemCount; // 未测量的项目数
  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize; // 未测量项目的总大小
  return totalSizeOfUnmeasuredItems
}

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
