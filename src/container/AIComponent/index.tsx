import styled from "styled-components"
import ScreenShot from "js-web-screen-shot";
import { useState } from "react";
const AIComponent = () => {
  const [imgSrc, setImgSrc] = useState('')
  const handleScreenShot = () => {
    const callback = ({base64, cutInfo})=>{
      console.log(base64, cutInfo);
      setImgSrc(base64)
    }
    // 截图取消时的回调函数
    const closeFn = ()=>{
      console.log("截图窗口关闭");
    }
    new ScreenShot({enableWebRtc: true, completeCallback: callback,closeCallback: closeFn});
  }
  return (
    <StyledAIComponent>
      <div className="left-area">
        <img src="/img2.png" alt="" />
      </div>
      <div className="right-area">
        <button onClick={handleScreenShot}>截图</button>
        <div>
          <img src={imgSrc} alt="" />
        </div>
      </div>
      
    </StyledAIComponent>
  )
}

const StyledAIComponent = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 100px auto;

  .left-area {
    img {
      width: 400px;
    }
  }
`

export {
  AIComponent
}