import React, { useRef, useEffect } from 'react';

const IframeComponent = ({ userHtml }) => {
  // 创建一个ref来引用iframe DOM元素
  const iframeRef = useRef(null);

  // 一个函数来绑定事件到iframe内的元素
  const bindEvents = (iframeDocument) => {
    // 例如，给iframe中的所有按钮添加点击事件
    const buttons = iframeDocument.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Button inside iframe clicked');
        // 在这里处理你的逻辑
      });
    });
  };

  // 使用useEffect来在组件渲染后处理iframe的内容和事件绑定
  useEffect(() => {
    const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

    // 将用户输入的HTML代码写入iframe
    iframeDocument.open();
    iframeDocument.write(userHtml);
    iframeDocument.close();

    // 绑定事件到iframe内的元素
    bindEvents(iframeDocument);
  }, [userHtml]); // 依赖列表中的userHtml确保当用户输入改变时重新渲染

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts"
      style={{ width: '100%', height: '500px', border: 'none' }}
    />
  );
};

export {
  IframeComponent
};