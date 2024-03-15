import { useDispatch, useSelector } from "react-redux"
import { getMessagesAssistant } from "./selector"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { getTextContent, getUserMessage, handleAssistantMessage } from "./util"
import React from "react"
import { InputArea } from "./Input"
import { reportMessage } from "./actions"
import { IframeComponent } from "./3"

export const GenerateComponent = () => {
  const assistantMessages = useSelector(getMessagesAssistant)
  const containerRef = React.useRef(null)
  const contentContainerRef = React.useRef(null)
  const contentIframeRef = React.useRef(null)
  const dispatch = useDispatch()
  console.log('assistantMessages', assistantMessages)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [textAreaValue, setTextAreaValue] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)
  const selectedElementsRef = React.useRef([])
  const lastHighlightedElementRef = React.useRef(null)

  const activeMessage = assistantMessages[activeIndex]
  const content = handleAssistantMessage(activeMessage)

  const handleEditMode = () => {
    setIsEdit(!isEdit)
  }

  const highlightElement = (event) => {
    // const contentContainer = contentContainerRef.current;

    // if (!contentContainer) return
    // if (!contentContainer.contains(event.target)) return; // 忽略不是内容区域的元素
    const contentIframe = contentIframeRef.current
    if (!contentIframe) return
    if (!contentIframe.contentWindow.document.contains(event.target)) return; // 忽略不是内容区域的元素
    if (lastHighlightedElementRef.current) {
      removeHighlight({ target: lastHighlightedElementRef.current });
    }
    event.target.style.outline = '2px solid magenta'; // 将颜色改为品红色
    lastHighlightedElementRef.current = event.target;
  }

  const removeHighlight = (event) => {
    if (!selectedElementsRef.current.includes(event.target)) {
      event.target.style.outline = '';
    }
  }

  const selectElement = (event) => {
    // const contentContainer = contentContainerRef.current;
    // if (!contentContainer) return
    // if (!contentContainer.contains(event.target)) return; // 忽略不是内容区域的元素
    const contentIframe = contentIframeRef.current
    if (!contentIframe) return
    if (!contentIframe.contentWindow.document.contains(event.target)) return; // 忽略不是内容区域的元素
    if (event.shiftKey) {
      const targetElement = event.target;
      if (!selectedElementsRef.current.includes(targetElement)) {
        targetElement.style.outline = '2px solid magenta'; // 将颜色改为品红色
        selectedElementsRef.current.push(targetElement);
      }
    } else {
      if (!selectedElementsRef.current.includes(event.target)) {
        selectedElementsRef.current.forEach(element => element.style.outline = '');
        selectedElementsRef.current = [];
        event.target.style.outline = '2px solid magenta'; // 将颜色改为品红色
        selectedElementsRef.current.push(event.target);
      }
    }
    updateSelectedElementsDisplay();
    event.preventDefault();
    event.stopPropagation();
  }

  const updateSelectedElementsDisplay = () => {
    setSelectedCount(selectedElementsRef.current.length);
    const formattedElements = selectedElementsRef.current.map(element => {
      // console.log('======', element.outerHTML)
      // const elementTagName = element.tagName.toLowerCase();
      // const elementId = element.id ? ` id="${element.id}"` : '';
      // const elementClasses = element.className ? ` class="${element.className}"` : '';
      // return `<${elementTagName}${elementId}${elementClasses}>${''}</${elementTagName}>`;
      return element.outerHTML
    }).join('\n');

    setTextAreaValue(formattedElements);
  }

  console.log('selectedElementsRef', selectedElementsRef.current)
  console.log('---formattedElements', textAreaValue)
  // useEffect(() => {
  //   if (isEdit) {
  //     document.addEventListener('mouseover', highlightElement);
  //     document.addEventListener('mouseout', removeHighlight);
  //     document.addEventListener('click', selectElement, true);
  //   }
  //   return () => {
  //     document.removeEventListener('mouseover', highlightElement);
  //     document.removeEventListener('mouseout', removeHighlight);
  //     document.removeEventListener('click', selectElement, true);
  //   }
  // }, [isEdit])

  const onClickSend = (value) => {
    console.log('value', value)

    const content = getTextContent(value + textAreaValue)
    const userMessage = getUserMessage([content])
    dispatch(reportMessage(userMessage))
  }

  const addActiveIndex = () => {
    const newIndex = Math.min(activeIndex + 1, assistantMessages.length - 1)
    setActiveIndex(newIndex)
  }
  const subActiveIndex = () => {
    const newIndex = Math.max(activeIndex - 1, 0)
    setActiveIndex(newIndex)
  }

  const handleRetry = () => {

  }

  const htmlScript = `
    document.addEventListener('mouseover', function(event) {
      
    }
  `

  useEffect(() => {
    const contentIframe = contentIframeRef.current
    if(!contentIframe) return
    if(isEdit) {
      contentIframe.contentWindow.document.addEventListener('mouseover', highlightElement);
      contentIframe.contentWindow.document.addEventListener('mouseout', removeHighlight);
      contentIframe.contentWindow.document.addEventListener('click', selectElement, true);
      contentIframeRef.current.contentWindow.document.body.style.cursor = 'crosshair';
    } else {
      contentIframe.contentWindow.document.removeEventListener('mouseover', highlightElement);
      contentIframe.contentWindow.document.removeEventListener('mouseout', removeHighlight);
      contentIframe.contentWindow.document.removeEventListener('click', selectElement, true);
      contentIframeRef.current.contentWindow.document.body.style.cursor = 'auto';
    }
    return () => {
      contentIframe.contentWindow.document.removeEventListener('mouseover', highlightElement);
      contentIframe.contentWindow.document.removeEventListener('mouseout', removeHighlight);
      contentIframe.contentWindow.document.removeEventListener('click', selectElement, true);
      contentIframeRef.current.contentWindow.document.body.style.cursor = 'auto';
    }
  }, [isEdit, contentIframeRef.current])
  return (
    <StyledGenerateComponent className="generate-component-container">
      <h3>生成效果</h3>
      <div id="container" className="container" ref={containerRef}>
        <span className="iconify drag-icon" data-icon="grommet-icons:drag" ref={containerRef}></span>
        {/* <div className="contentContainer" ref={contentContainerRef} dangerouslySetInnerHTML={{ __html: content }}></div> */}
        {/* <iframe id="chatgpt-iframe"  sandbox="allow-scripts allow-forms"  ref={contentIframeRef} srcDoc={content} style={{ width: '100%', height: '100%'}}></iframe> */}
        <IframeComponent htmlContent={content} />
      </div>
      {
        isEdit && <>
          <div style={{ color: 'green' }}>进入编辑模式,可选中元素</div>
          <div>已选中元素数量：{selectedCount}</div>
          {/* {textAreaValue && <textarea id="selectedElementName" value={textAreaValue}></textarea>} */}
          <InputArea onClickSend={onClickSend} />
        </>
      }
      <div>

        {/* <button onClick={handleRetry}>重新生成</button> */}
        {/* <button>确认</button> */}
      </div>
      <div>
        <button onClick={handleEditMode}>{isEdit ? '退出编辑' : '编辑'}</button>
        <button onClick={subActiveIndex}>上一张</button>
        {activeIndex + 1}/{assistantMessages.length}
        <button onClick={addActiveIndex}>下一张</button>
      </div>
    </StyledGenerateComponent>
  )
}

const StyledGenerateComponent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .container {
    flex: 1;
    margin: 24px 0;

    .drag-icon {
      position: absolute;
      left: -16px;
      top: -16px;
      cursor: move;
      z-index: 1000;
    }
  }


    .isCapturing {
        cursor: crosshair !important;
    }

    #selectedElementName {
      width: 100%;
      height: 100px;
    }

    iframe {
      zoom: 0.8;
      transform: scale(0.8);
      transform-origin: 0 0;
      border: none;

    /* -moz-transform: scale(0.8);
    -moz-transform-origin: 0 0;
    -o-transform: scale(0.8);
    -o-transform-origin: 0 0;
    -webkit-transform: scale(0.8);
    -webkit-transform-origin: 0 0; */
    }
`