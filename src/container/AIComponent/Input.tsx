import { useState } from "react";

export const InputArea = ({ onClickSend }) => {
  // const value = '请将选中元素修字体修改为红色，其他部分保持不变，再原样输出'
  const [value, setValue] = useState('');
  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const handleEditAction = () => {
    console.log('value', value)
    onClickSend(value)
  }
  return (
    <div style={{ display: 'flex',  alignItems: 'flex-end', justifyContent: 'center', margin: '8px 0'}}>
      <textarea value={value} placeholder="请输入修改意见" onChange={handleInput} style={{ height: 60}}/>
      <button onClick={handleEditAction}>发送修改意见</button>
    </div>
  )
}