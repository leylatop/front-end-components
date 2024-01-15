import { createContext, useState } from "react"

export const ListContext = createContext({
  isCompletedAll: false,
  setIsCompletedAll: (bool) => bool
})

export const ListContainer = ({ children }) => {
  const [ isCompletedAll, setIsCompletedAll ] = useState(false)
  // console.log('---isCompletedAll', isCompletedAll)
  return (
    <ListContext.Provider value={{ isCompletedAll, setIsCompletedAll }}>
      {children}
    </ListContext.Provider>
  )
}