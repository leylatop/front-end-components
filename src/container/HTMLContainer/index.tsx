import styled from 'styled-components'
// import { useDispatch, useSelector } from 'react-redux'
import { EXAMPLE_ECHART, EXAMPLE_HIT, EXAMPLE_抽奖 } from './constants'
import { useState } from 'react'


export const HtmlContainer = ({ style }) => {
  // const dispatch = useDispatch()
  // const assistantDataList = useSelector(getAIComponentAssistantDataList)
  const assistantDataList = [
    { html: EXAMPLE_抽奖, width: 400, height: 300 },
    { html: EXAMPLE_ECHART, width: 400, height: 300 },
    { html: EXAMPLE_HIT, width: 400, height: 300}
   ]
  // const assistantDataIndex = useSelector(getAIComponentAssistantDataIndex)
  const [assistantDataIndex, setAssistantDataIndex] = useState(0)
  const assistantData = assistantDataList[assistantDataIndex]
  const { html, width, height } = assistantData || {}
  // const activeHTMLIndex = useSelector(getAIComponentActiveHTMLIndex)
  // const assistantHTML = assistantHTMLList[activeHTMLIndex]
  // if (!assistantHTML) return null
  // if (assistantHTMLList.length === 0) return null
  console.log(assistantData)
  const handleRetry = () => {
    // dispatch({ type: 'entry:aiComponent:request:generate-component' })
  }

  const handleConfirm = () => {
    // dispatch({ type: 'entry:aiComponent:confirm:generate-component' })
  }

  const handlePrev = () => {
    setAssistantDataIndex(assistantDataIndex - 1)
    // dispatch({ type: 'ai-component:update:assistantDataIndex', payload: { assistantDataIndex: assistantDataIndex - 1 } })
  }

  const handleNext = () => {
    setAssistantDataIndex(assistantDataIndex + 1)
    // dispatch({ type: 'ai-component:update:assistantDataIndex', payload: { assistantDataIndex: assistantDataIndex + 1 } })
  }

  const handleMouseDown = () => {
    
  }
  document.addEventListener('mousedown', (e) => {
    console.log('mousedown')
    
  })

  // 1. 设置该组件的选中状态 - done
  // 2. 为组件添加拖拽改变大小的功能
  // 3. 为组件添加拖拽移动的功能
  // 4. 优化工具栏的样式
  // 优化工具栏的位置 => 使用 floatbar设置位置
  return (
    <StyledHTMLContainer style={style} >
      <ToolBar
        length={assistantDataList.length}
        activeIndex={assistantDataIndex}
        handleRetry={handleRetry}
        handleConfirm={handleConfirm}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <div className="html-container-box" style={{ width, height }} onMouseDown={handleMouseDown}>
        <iframe sandbox="allow-script" srcDoc={html}></iframe>
      </div>
    </StyledHTMLContainer>

  )
}

const StyledHTMLContainer = styled.div`
  position: absolute;
  background: #fff;
  left: 248.831px; top: 229px;

  .html-container-box {
    /* border: 1px solid ${props => props.theme.color_proto}; */
    border: 1px solid blue;
  }
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    pointer-events: none;
  }
`

const ToolBar = ({ length, activeIndex, handleRetry, handleConfirm, handlePrev, handleNext }) => {
  return <StyledToolBar>
    {
      length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div onClick={handlePrev}>前</div>
          <div>{activeIndex + 1}/{length}</div>
          <div onClick={handleNext}>后</div>
        </div>
      )
    }
    <button onClick={handleRetry}>重新生成</button>
    <button onClick={handleConfirm}>确认</button>
    <button>点赞</button>
    <button>踩</button>
  </StyledToolBar>
}

const StyledToolBar = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;

  button {
    background-color: #1684fc;
    border-radius: 4px;
    border: none;
    outline: none;
    color: #FFF;
    display: block;
    padding: 4px;
  }
`