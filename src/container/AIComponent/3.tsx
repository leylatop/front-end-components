import React, { useEffect, useState } from "react";

const IframeComponent = ({ htmlContent }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = React.createRef();

  // 在iframe加载完成后绑定事件
  useEffect(() => {
    if (iframeLoaded) {
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

      // 为iframe内的所有元素添加事件监听，根据需要调整选择器和事件类型
      const elements = iframeDocument.querySelectorAll('selector-for-elements');
      elements.forEach((element) => {
        element.addEventListener('event-type', (event) => {
          // 事件处理逻辑
          console.log('Event triggered in iframe:', event);
        });
      });
    }
  }, [iframeLoaded]);

  return (
    <iframe
      ref={iframeRef}
      // sandbox="allow-scripts"
      srcDoc={htmlContent}
      onLoad={() => setIframeLoaded(true)}
      style={{ width: '100%', height: '500px', border: 'none' }}
    />
  );
};

export {
  IframeComponent
}
