import { VariableSizeList } from 'react-window';
import './VariableSizeListCustom.css';

const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 50))

const getItemSize = index => rowSizes[index]

const Row = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven' } style={style}>
    Row {index}
  </div>
);

const VariableSizeListCustom = () => {
  return (
    <VariableSizeList
      className="List"
      height={200}
      width={200}
      itemCount={1000}
      itemSize={getItemSize}
    >
      {Row}
    </VariableSizeList>
  )
}

export {
  VariableSizeListCustom
}