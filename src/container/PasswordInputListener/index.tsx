import React from 'react';

export const PasswordInputListener = () => {
  const [capsLockState, setCapsLockState] = React.useState(false);
  const ref = React.createRef<HTMLInputElement>();
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const capsLock = e.getModifierState('CapsLock');
    console.log('capsLock', capsLock);
    if (capsLock !== capsLockState) {
      setCapsLockState(capsLock);
    }

    // 禁止复制密码输入框中的内容
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
    }
  }
  return (
    <>
      <input ref={ref} type="password" onKeyUp={onKeyUp} />
      {
        capsLockState && <div>CapsLock is on</div>
      }
    </>
  )
}