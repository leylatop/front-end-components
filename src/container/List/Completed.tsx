import { useContext, memo } from "react"
import { ListContext } from "./context"
export const Completed = memo(() => {
  const { isCompletedAll, setIsCompletedAll } = useContext(ListContext)
  console.log('---isCompletedAll', isCompletedAll)
  const handleClick = () => {
    setIsCompletedAll(!isCompletedAll)
  }
  return (
    <div>
      <input type="checkbox" checked={isCompletedAll} onClick={handleClick}/>
      <span>{ isCompletedAll ? '全选' : '取消全选' }</span>
    </div>
  )
})