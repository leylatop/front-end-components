import React, { useState, useRef, useEffect } from 'react';

const DraggableDivAlongSvgPath = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pathLength, setPathLength] = useState(0);
  const [currentLength, setCurrentLength] = useState(0);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const divRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const pathElement = pathRef.current;
    const totalLength = pathElement.getTotalLength();
    setPathLength(totalLength);
    const initialPoint = pathElement.getPointAtLength(0);
    setPosition(initialPoint);
    setCurrentLength(0);
  }, []);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;

    const svgElement = svgRef.current;
    const pathElement = pathRef.current;
    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    const closestLength = getClosestLengthOnPath(pathElement, mouseX, mouseY);
    setCurrentLength(closestLength);
    const newPoint = pathElement.getPointAtLength(closestLength);
    setPosition(newPoint);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const getClosestLengthOnPath = (pathElement, x, y) => {
    let closestLength = 0;
    let closestDistance = Infinity;

    // 使用二分搜索来找到最近的点
    const binarySearch = (start, end, threshold) => {
      if (end - start < threshold) return (start + end) / 2;

      const mid = (start + end) / 2;
      const leftThird = (2 * start + end) / 3;
      const rightThird = (start + 2 * end) / 3;

      const midPoint = pathElement.getPointAtLength(mid);
      const leftPoint = pathElement.getPointAtLength(leftThird);
      const rightPoint = pathElement.getPointAtLength(rightThird);

      const midDist = distance(x, y, midPoint.x, midPoint.y);
      const leftDist = distance(x, y, leftPoint.x, leftPoint.y);
      const rightDist = distance(x, y, rightPoint.x, rightPoint.y);

      if (leftDist < midDist && leftDist < rightDist) {
        return binarySearch(start, mid, threshold);
      } else if (rightDist < midDist && rightDist < leftDist) {
        return binarySearch(mid, end, threshold);
      } else {
        return binarySearch(leftThird, rightThird, threshold);
      }
    };

    return binarySearch(0, pathLength, 0.1);
  };

  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  return (
    <div className="relative w-[380px] h-[271px]">
      <svg
        ref={svgRef}
        width="380"
        height="271"
        viewBox="0 0 380 271"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0"
      >
        <path
          ref={pathRef}
          d="M0 136 L95 136 Q95 136 95 136 L95 0 Q95 0 95 0 L380 0 Q380 0 380 0 L380 271 Q380 271 380 271 L228 271"
          strokeWidth="2"
          stroke="rgba(153,153,153,1)"
          fill="none"
        />
      </svg>
      <div
        ref={divRef}
        className="absolute w-8 h-8 bg-blue-500 rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default DraggableDivAlongSvgPath;