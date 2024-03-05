import createListComponent from './createListComponent'

const DEFAULT_ESTIMATED_ITEM_SIZE = 50
/**
 * estimatedItemSize: 估计的项目大小
 * itemCount: 项目数
 * lastMeasuredIndex: 最后测量的索引
 * itemMetadataMap: 项目元数据映射
 * @returns 
 */
const getEstimatedTotalSize = ({ itemCount }, { estimatedItemSize, lastMeasuredIndex, itemMetadataMap }) => {
  let totalSizeOfMeasuredItems = 0; // 测量项目的总大小
  if (lastMeasuredIndex >= 0) {
    const itemMetadata = itemMetadataMap[lastMeasuredIndex]; // 最后测量的项目元数据
    totalSizeOfMeasuredItems = itemMetadata.offset + itemMetadata.size; // 测量项目的总大小
  }
  const numUnmeasuredItems = itemCount - lastMeasuredIndex - 1; // 未测量的项目数

  const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedItemSize; // 未测量项目的总大小

  return totalSizeOfUnmeasuredItems + totalSizeOfMeasuredItems; // 未测量项目的总大小 + 测量项目的总大小
}

// 根据偏移量找到最接近的项目
function findNearestItem(props, instanceProps, offset) {
  const { lastMeasuredIndex } = instanceProps;
  // 在已测量的项目中找到最接近的项目
  for (let index = 0; index <= lastMeasuredIndex; index++) {
    const currentOffset = getItemMetadata(props, index, instanceProps).offset;
    if (currentOffset >= offset) {
      return index;
    }
  }
  return 0;
}

// 获取项目的元数据，并更新最后测量的索引
function getItemMetadata(props, index, instanceProps) {
  const { itemSize } = props;
  const { itemMetadataMap, lastMeasuredIndex } = instanceProps;
  
  // 如果当前索引大于最后测量的索引
  // 只有向下滚动时，且之前没有计算过，才会进入这个分支
  if (index > lastMeasuredIndex) {
    let offset = 0;//先计算上一个测试过的条目的下一个offset
    if (lastMeasuredIndex >= 0) {
      // 获取最后测量的索引的元数据
      const itemMetadata = itemMetadataMap[lastMeasuredIndex];
      offset = itemMetadata.offset + itemMetadata.size;
    }
    // 计算最后测量的索引到当前索引的offset和size
    // 理论上来说，这里的循环只会执行一次，但是为了保险起见，还是用循环
    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      let size = itemSize(i);
      itemMetadataMap[i] = { offset, size };
      offset += size;
    }
    instanceProps.lastMeasuredIndex = index;
  }
  return itemMetadataMap[index];
}

const VariableSizeList = createListComponent({
  getEstimatedTotalSize,
  getStartIndexForOffset: (props, offset, instanceProps) => findNearestItem(props, instanceProps, offset),
  getStopIndexForStartIndex: (props, startIndex, scrollOffset, instanceProps) => {
    const { itemCount, height } = props;
    const itemMetadata = getItemMetadata(props, startIndex, instanceProps);
    // 最大偏移量为滚动偏移量加上高度
    const maxOffset = scrollOffset + height;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;
    // 从开始索引开始，找到最接近的项目
    while (offset < maxOffset && stopIndex < itemCount - 1) {
      stopIndex++;
      offset += getItemMetadata(props, stopIndex, instanceProps).size;
    }
    return stopIndex;
  },
  getItemSize: (props, index, instanceProps) => getItemMetadata(props, index, instanceProps).size,
  getItemOffset: (props, index, instanceProps) => getItemMetadata(props, index, instanceProps).offset,
  initInstanceProps: (props) => {
    const { estimatedItemSize } = props
    const instanceProps = {
      estimatedItemSize: estimatedItemSize || DEFAULT_ESTIMATED_ITEM_SIZE,
      lastMeasuredIndex: -1, // 最后测量的索引
      itemMetadataMap: {}, // 存放每个项目的元数据（offset和size）
    }
    return instanceProps
  }
})

export default VariableSizeList
