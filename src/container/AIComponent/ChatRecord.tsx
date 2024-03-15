import { useEffect, useRef } from "react"
import styled  from "styled-components"
import ReactMarkdown from 'react-markdown'
import { useSelector } from "react-redux"
import { getMessages } from "./selector"
import { USER_ROLE, ASSISTANT_ROLE, SYSTEM_ROLE } from "./constants"

export const ChatRecord = () => {
  const containerRef = useRef(null)
  const messages = useSelector(getMessages)
  useEffect(() => {
    // 自动滚动到最底端
    containerRef.current!.scrollTop = containerRef.current!.scrollHeight
  }, [messages])

  return (
    <StyledChatRecord ref={containerRef}>
      {
        messages.map((message, index) => {
          const { content, role } = message
          if(typeof content === 'string') {
            return (
              <div key={index} className={`message ${role}`}>
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
            )
          } else {
            if(Array.isArray(content)) {
              return content.map((item, index) => {
                const { type, text, image_url } = item
                if(type === 'image_url') {
                  return (
                    <div key={index} className={`message ${role}`}>
                      <img src={image_url.url} alt="" />
                    </div>
                  )
                } else if(type === 'text') {
                  return (
                    <div key={index} className={`message ${role}`}>
                      <ReactMarkdown>
                        {text}
                      </ReactMarkdown>
                    </div>
                  )
                }
              })
            }
          }
        })
      }
    </StyledChatRecord>
  )
}

const StyledChatRecord = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  overflow: auto;
  position: relative;

  .message {
    margin: 16px 0;
    padding: 8px;
    font-size: 12px;
    border-radius: 4px;
    text-align: justify;
    width: fit-content;
    line-height: 150%;
    position: relative;
    overflow: hidden;

    &.${SYSTEM_ROLE} {
      background-color: rgb(244, 244, 245);
      color: #000000;
    }

    &.${USER_ROLE} {
      background-color: rgb(59, 130, 246);
      color: #FFFFFF;
      position: relative;

      img {
        width: 200px;
      }
    }

    &.${ASSISTANT_ROLE} {
      background-color: rgb(244, 244, 245);
      color: #000000;
    }

    p {
      margin: 0;
    }

    ol {
      list-style: decimal;
      padding-left: 16px;
      margin: 16px 0;
    }

    ul {
      list-style: disc;
      padding-left: 16px;
      margin: 16px 0
    }

    li p {
      margin: 8px 0;
    }

    pre {
      background: rgb(26, 27, 38);
      color: rgb(203, 210, 234);
      padding: 16px 16px 8px;
      overflow: auto;
      font-size: 12px;
      line-height: 1.5;
      border-radius: 6px;
      margin: 16px 0;
    }

    .copy-btn {
      border: none;
      background: transparent;
      position: absolute;
      bottom: 8px;
      right: 16px;
      width: 16px;
      height: 16px;
      outline: none;
      cursor: pointer;
    }
  }

  &::-webkit-scrollbar {
    display: block;
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(219, 219, 219);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`