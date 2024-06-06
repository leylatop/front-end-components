import React, { useState, useEffect } from 'react';

const ExampleText = "这是一个示例文本"; // 预备好的示例文本

function InputContainer() {
  const [text, setText] = useState(localStorage.getItem('inputText') || "");
  const [isShowExampleBtn, setIsShowExampleBtn] = useState(false);
  const util = (() => {
    const stack = [];
    const push = (item) => {
      stack.push(item);
    }
    const pop = () => {
      return stack.pop();
    }
  })()

  // 更新 localStorage 中的文本
  useEffect(() => {
    console.log('text:', text);
    localStorage.setItem('inputText', text);
  }, [text]);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      // 监听ctrl + z 撤销操作

    });
  }, [isShowExampleBtn]);

  const handleExampleClick = () => {
    const randomText = Math.random().toString(36).substring(7);
    setText(ExampleText + randomText);
    
  };

  const handleTextChange = (e) => {
    const value = e.target.value;

    setText(value);
    setIsShowExampleBtn(value.length === 0); // 判断是否为示例文本
  };

  const handleOptimizeClick = () => {
    const optimizedText = optimizeText(text); // 根据需要实现优化逻辑
    setText(optimizedText);
  };

  const optimizeText = (inputText) => {
    // 这里加入具体的优化逻辑，可以替换为你自己的优化算法
    const randomText = Math.random().toString(36).substring(7);
    return inputText + randomText;
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="请输入文本"
      />
      {text === "" || isShowExampleBtn ? (
        <button onClick={handleExampleClick}>示例</button>
      ) : (
        <button onClick={handleOptimizeClick}>优化</button>
      )}
    </div>
  );
}

export {
  InputContainer
}

