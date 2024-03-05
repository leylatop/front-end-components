import { FixedSizeList } from './react-window';
import './FixedSizeListCustom.css';
const Row = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven' } style={style}>
    Row {index}
  </div>
);
const FixedSizeListCustom = () => {
  return (
    <FixedSizeList
      className="List"
      height={200}
      width={200}
      itemCount={1000}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  )
}


export {
  FixedSizeListCustom
}