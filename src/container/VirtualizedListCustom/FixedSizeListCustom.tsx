import { FixedSizeList } from './react-window';
import './FixedSizeListCustom.css';
const Row = ({ index, style, isScrolling }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven' } style={style}>
    {
      isScrolling ? 'Scrolling' : `Row ${index}`
    }
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
      useIsScrolling
    >
      {Row}
    </FixedSizeList>
  )
}


export {
  FixedSizeListCustom
}