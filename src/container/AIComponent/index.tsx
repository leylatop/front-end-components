import styled from "styled-components"
import ScreenShot from "js-web-screen-shot";
import { useDispatch } from 'react-redux'
import { clearMessages, initMessages, reportMessage } from './actions'
import { getImageContent, getTextContent, getUserMessage } from './util'
import { ChatRecord } from "./ChatRecord";
import { Provider } from 'react-redux'
import { createStore } from '../../utils/createStore';
import reducer from './reducer'
import { GenerateComponent } from "./GenerateComponent";
import { useEffect } from "react";

const AIComponentContainer = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initMessages())
  }, [])
  const handleScreenShot = () => {
    const callback = ({ base64, cutInfo }) => {
      const imageContent = getImageContent(base64)
      // const textContent = getTextContent("请按照上述提示，使用代码实现这张图片的效果")
      // const userMessage = getUserMessage([textContent, imageContent])
      const userMessage = getUserMessage([imageContent])

      dispatch(reportMessage(userMessage))
    }
    // 截图取消时的回调函数
    const closeFn = () => {
      console.log("截图窗口关闭");
    }
    new ScreenShot({ enableWebRtc: true, completeCallback: callback, closeCallback: closeFn });
  }
  return (
    <Provider store={store}>
      <StyledAIComponent>
      <div className="top-area">
        <div className="left-area">
          <img src="/img2.png" alt="" />
          <div>
            <button onClick={handleScreenShot}>点我进行截图</button>
          </div>
        </div>
        <div className="right-area">
          <GenerateComponent />
        </div>
      </div>
      <div className="bottom-area">
        <h2>聊天记录</h2>
        <div className="chat-record-container">
          <ChatRecord />
        </div>
        <button onClick={() => dispatch(clearMessages())}>清除记录</button>
      </div>

    </StyledAIComponent>
    </Provider>
  )
}

const StyledAIComponent = styled.div`
  * {
    margin: 0;
    padding: 0;
  }
  display: flex;
  flex-direction: column;
  height: 100%;

  button {
    padding: 8px;
    margin: 4px;
  }

  .top-area {
    width: 80%;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    margin: 30px auto;
    .left-area {
      flex: 1;
      padding: 8px;
      border: 1px solid blue;
      margin: 0 4px;
      img {
        width: 300px;
      }
      button {
        background-color: blue;
        color: #FFF;
      }
    }

    .right-area {
      flex: 1;
      padding: 8px;
      border: 1px solid red;
      margin: 0 4px;

      button {
        background-color: red;
        color: #FFF;
      }
    }
  }
  .bottom-area {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: auto;

    .chat-record-container {
      flex: 1;
      min-height: 0;
      /* overflow-y: auto; */
    }
  }
`

const store = createStore(reducer)
window.store = store
console.log('store', store.getState())

const AIComponent = () => {
  return <Provider store={store}>
    <AIComponentContainer />
  </Provider>
}
export {
  AIComponent
}