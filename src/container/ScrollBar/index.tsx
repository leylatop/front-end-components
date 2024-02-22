import React from "react";
import { ScrollBar2 } from "./ScrollBar";
import styled from "styled-components";

export const ScrollBar = () => {
  const [count, setCount] = React.useState(100)
  const handleAdd = () => {
    setCount(count + 1)
  }
  const handleDelete = () => {
    setCount(count - 1)
  }
  return (
    <StyledContainer>
      <h1>ScrollBar</h1>
      <button onClick={handleAdd} style={{ height: 40 }}>add</button>
      <button onClick={handleDelete} style={{ height: 40 }}>delete</button>
      <ScrollBar2 isAutoHideBar={true} className="container">
        <div className="content">
          {
            Array.from({ length: count }).map((_, index) => {
              return <div key={index}>{index + 1}</div>
            })
          }
        </div>
        {
          Array.from({ length: count }).map((_, index) => {
            return <div key={index}>{index + 1}</div>
          })
        }
      </ScrollBar2>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .container {
    display: 1;
    min-height: 0;

    .content {
      display: flex;
    }
  }
`
