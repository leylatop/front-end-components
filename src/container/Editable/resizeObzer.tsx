import React, { Component, ReactElement, ReactInstance, cloneElement, isValidElement } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import lodashThrottle from 'lodash/throttle';
// import { callbackOriginRef, findDOMNode } from '../_util/react-dom';
import { supportRef } from './is';
import ReactDOM from 'react-dom';

export interface ResizeProps {
  throttle?: boolean;
  onResize?: (entry: ResizeObserverEntry[]) => void;
  children?: React.ReactNode;
  getTargetDOMNode?: () => any;
}

class ResizeObserverComponent extends React.Component<ResizeProps> {
  resizeObserver: ResizeObserver;

  rootDOMRef: any;

  getRootElement = () => {
    const { getTargetDOMNode } = this.props;
    return findDOMNode(getTargetDOMNode?.() || this.rootDOMRef, this);
  };

  getRootDOMNode = () => {
    return this.getRootElement();
  };

  componentDidMount() {
    if (!React.isValidElement(this.props.children)) {
      console.warn('The children of ResizeObserver is invalid.');
    } else {
      this.createResizeObserver();
    }
  }

  componentDidUpdate() {
    if (!this.resizeObserver && this.getRootElement()) {
      this.createResizeObserver();
    }
  }

  componentWillUnmount = () => {
    if (this.resizeObserver) {
      this.destroyResizeObserver();
    }
  };

  createResizeObserver = () => {
    const { throttle = true } = this.props;
    const onResize = (entry) => {
      this.props.onResize?.(entry);
    };

    const resizeHandler = throttle ? lodashThrottle(onResize) : onResize;

    let firstExec = true; // 首次监听时，立即执行一次 onResize，之前行为保持一致，避免布局类组件出现闪动的情况
    this.resizeObserver = new ResizeObserver((entry) => {
      if (firstExec) {
        firstExec = false;
        onResize(entry);
      }
      resizeHandler(entry);
    });
    const targetNode = this.getRootElement();
    targetNode && this.resizeObserver.observe(targetNode as Element);
  };

  destroyResizeObserver = () => {
    this.resizeObserver && this.resizeObserver.disconnect();
    this.resizeObserver = null;
  };

  render() {
    const { children } = this.props;

    // // if (supportRef(children) && isValidElement(children) && !this.props.getTargetDOMNode) {
    //   return cloneElement(children as ReactElement, {
    //     ref: (node) => {
    //       this.rootDOMRef = node;

    //       callbackOriginRef(children, node);
    //     },
    //   });
    // // }
    // this.rootDOMRef = null;
    return this.props.children;
  }
}

export default ResizeObserverComponent;

const isFunction = (fn) => typeof fn === 'function';
// 回调children的原始 ref ，适配函数 ref or ref.current 场景
export const callbackOriginRef = (children: any, node) => {
  if (children && children.ref) {
    if (isFunction(children.ref)) {
      children?.ref(node);
    }
    if ('current' in children.ref) {
      children.ref.current = node;
    }
  }
};

/**
 *
 * @param element
 * @param instance: 兜底 findDOMNode 查找，一般都是 this
 * @returns
 */
export const findDOMNode = (element: any, instance?: ReactInstance) => {
  // 类组件，非 forwardRef(function component) 都拿不到真实dom
  if (element && element instanceof Element) {
    return element;
  }

  if (element && element.current && element.current instanceof Element) {
    return element.current;
  }

  if (element instanceof Component) {
    return ReactDOM.findDOMNode(element);
  }

  if (element && isFunction(element.getRootDOMNode)) {
    return element.getRootDOMNode();
  }

  // 一般 useImperativeHandle 的元素拿到的 ref 不是 dom 元素且不存在 getRootDOMNode ，会走到这里。
  if (instance) {
    // warning(
    //   !hasInstanceWarned(instance),
    //   'Element does not define the `getRootDOMNode` method causing a call to React.findDOMNode. but findDOMNode is deprecated in StrictMode. Please check the code logic',
    //   { element, instance }
    // );
    return ReactDOM.findDOMNode(instance);
  }

  return null;
};