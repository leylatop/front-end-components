import React, { useState, useRef, useEffect } from 'react';

const DraggableDivAlongSvgPath = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const divRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const svgElement = svgRef.current;
    const pathElement = svgElement.querySelector('path');
    const pathLength = pathElement.getTotalLength();
    const initialPoint = pathElement.getPointAtLength(0);
    setPosition({ x: initialPoint.x, y: initialPoint.y });
  }, []);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;

    const svgElement = svgRef.current;
    const pathElement = svgElement.querySelector('path');
    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    const closestPoint = getClosestPointOnPath(pathElement, mouseX, mouseY);
    setPosition(closestPoint);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const getClosestPointOnPath = (pathElement, x, y) => {
    const pathLength = pathElement.getTotalLength();
    let precision = 8;
    let best;
    let bestLength;
    let bestDistance = Infinity;

    // First pass: find the approximate location
    for (let scan = 0; scan <= pathLength; scan += pathLength / precision) {
      const point = pathElement.getPointAtLength(scan);
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);

      if (distance < bestDistance) {
        best = point;
        bestLength = scan;
        bestDistance = distance;
      }
    }

    precision *= 2;

    // Second pass: refine the location
    let lower = Math.max(0, bestLength - pathLength / precision);
    let upper = Math.min(pathLength, bestLength + pathLength / precision);
    while (upper - lower > 0.5) {
      const middleLength = (upper + lower) / 2;
      const middlePoint = pathElement.getPointAtLength(middleLength);
      const middleDistance = Math.sqrt((middlePoint.x - x) ** 2 + (middlePoint.y - y) ** 2);

      if (middleDistance < bestDistance) {
        best = middlePoint;
        bestLength = middleLength;
        bestDistance = middleDistance;
      }

      if (middleLength < bestLength) {
        lower = middleLength;
      } else {
        upper = middleLength;
      }
    }

    return best;
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