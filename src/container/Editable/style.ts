import styled from 'styled-components'

export const EditableContainer = styled.div`
  .auto-width-placeholder {
    visibility: hidden;
    /* position: absolute; */
    white-space: pre;
  }
  textarea {
      resize: none;
      min-height: auto;
      white-space: nowrap;
      overflow: hidden;
    }
  /* .editable-textarea {
    textarea {
      resize: none;
      min-height: auto;
      white-space: nowrap;
      overflow: hidden;
    }
  } */
`
