import React, { useState, useRef } from 'react';

function IframeComponent() {
  const [htmlContent, setHtmlContent] = useState('');
  const iframeRef = useRef(null);

  const handleInputChange = (e) => {
    setHtmlContent(e.target.value);
  };

  const handleLoadIframe = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    const iframeWindow = iframeRef.current.contentWindow;

    // 在iframe中直接插入用户输入的HTML内容。
    iframeDocument.open();
    iframeDocument.write(htmlContent);
    iframeDocument.close();

    // 给iframe内部的元素添加事件监听（例如，点击事件）。
    // 这里假设用户的HTML包含了一个id为"inside-iframe"的元素。
    const insideElement = iframeDocument.getElementById('inside-iframe');
    if (insideElement) {
      insideElement.addEventListener('click', () => {
        console.log('Element inside iframe clicked!');
      });
    }
  };

  return (
    <div>
      <textarea
        placeholder="Enter HTML content here"
        value={htmlContent}
        onChange={handleInputChange}
      />
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts" // 允许脚本运行但不允许访问父页面
        onLoad={handleLoadIframe}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
}

export default IframeComponent;
