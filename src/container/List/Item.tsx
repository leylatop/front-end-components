import { useContext } from "react"
import { ListContext } from "./context"
export const Item = ({ item, onClick }) => {
  const { isCompletedAll, setIsCompletedAll } = useContext(ListContext)
  const handleClick = (item) => {
    if(item.completed) {
      setIsCompletedAll(false)
    }
    onClick(item)
  }
  return (
    <div key={item.id} >
      <input type="checkbox" checked={item.completed} onChange={() => { handleClick(item) }}/>
      <span>{item.title}</span>
    </div>
  )
}