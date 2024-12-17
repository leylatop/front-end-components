import styled from 'styled-components'
// import { CUSTOM_CURSORS } from 'constant/cursors'

export const StyledPencilDraw = styled.div`
  position: relative;
  width: 800px;
  height: 800px;
  overflow: hidden;

  &.init-cursor {
    // 新增
  }

  .vector-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

`
