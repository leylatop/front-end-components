import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledTextArea = styled.textarea`
  width: 300px;
  height: 100px;
`;

const Button = styled.button`
  width: 150px;
  height: 30px;
`;

const TextEditor = () => {
  const [text, setText] = useState('');

  const [setTextProxy, redo, undo] = useTextEditorHistory(text, setText);

  const handleChange = (event) => {
    const newText = event.target.value;
    setTextProxy(newText);
  };

  const handleRandomText = () => {
    const randomText = Math.random().toString(36).substring(7);
    setTextProxy(randomText);
  }

  const handleOptiumText = () => {
    setTextProxy(text + '优化');
  }

  const handleKeyDown = (event) => {
    event.stopPropagation()
    if((event.ctrlKey || event.metaKey) && ["z","Z"].includes(event.key)) {
      event.preventDefault()
      if(event.shiftKey) {
        redo();
        return
      }
      undo()
    }
  };

  useEffect(() => {

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Container>
      <p>desc: 支持使用 ctrl + z/ctrl+shift+z 进行输入框的撤销与反撤销的操作</p>
      <StyledTextArea value={text} onChange={handleChange} />
      <Button onClick={handleRandomText}>Insert Random Text</Button>
      <Button onClick={handleOptiumText}>Insert Optium Text</Button>
    </Container>
  );
};

export {
  TextEditor as TextAreaUndoRedo
};

// 自定义输入框历史
export const useTextEditorHistory = (
  text: string,
  setText: (text: string) => any
) => {
  const historyRef = useRef<string[]>([text]);
  const historyIndexRef = useRef(0);

  const setTextProxy = (text: string) => {
    const history = historyRef.current;
    const historyIndex = historyIndexRef.current;

    history.length = historyIndex + 1;

    history.push(text);
    historyIndexRef.current++;

    setText(text);
  };

  const redo = () => {
    const currentIndex = historyIndexRef.current;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= historyRef.current.length) return;
    historyIndexRef.current++;

    setText(historyRef.current[nextIndex]);
  };

  const undo = () => {
    const currentIndex = historyIndexRef.current;
    const nextIndex = currentIndex - 1;

    if (nextIndex < 0) return;
    historyIndexRef.current--;

    setText(historyRef.current[nextIndex]);
  };

  return [setTextProxy, redo, undo] as const;
}