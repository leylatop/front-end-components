import { List } from "./List"
import { ListContainer as Provider } from "./context"
export const ListContainer = () => {
  return (
    <Provider>
      <List />
    </Provider>
  )
}