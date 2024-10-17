import React, { useState, useRef, useEffect } from 'react';

const DraggableDivAlongSvgPath = () => {
  const [position, setPosition] = useState(null); // div position = div length path length
  const [pathLength, setPathLength] = useState(0); // total length of the path
  
  const [proportion, setProportion] = useState(0.5); // div position along the path
  // const [currentLength, setCurrentLength] = useState(0); // div position along the path
  const [path, setPath] = useState("M0 136 L95 136 Q95 136 95 136 L95 0 Q95 0 95 0 L380 0 Q380 0 380 0 L380 271 Q380 271 380 271 L228 271");

  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const divRef = useRef(null);
  const isDraggingRef = useRef(false);
  // const isSetPositionFlag = useRef(false);

  useEffect(() => {
    updatePathAndPosition();
  }, [path]);

  const updatePathAndPosition = () => {
    const pathElement = pathRef.current;
    if (!pathElement) return;
    // path 的总长度
    const totalLength = pathElement.getTotalLength(); // get the total length of the path
    setPathLength(totalLength);
    // const 
    
    // Calculate new position, keeping the relative position constant
    // const currentPathLength = pathLength || totalLength; // default pathLength value is 0, so first time it will be totalLength
    // const newLength = Math.min((currentLength / currentPathLength) * totalLength, totalLength);
    // let newLength;
    // if(!isSetPositionFlag.current) {
    //   newLength = totalLength / 2; // set the div in the middle of the path
    // } else {
    //   // currentLength 不是最新的值，所以需要重新获取
    //   newLength = Math.min((currentLength / (pathLength || totalLength)) * totalLength, totalLength);
    // }
    // debugger
    // setCurrentLength(newLength);
    // div在path上的位置
    const pointRelativeToPath = totalLength * proportion; 
    try {
      // div在path上的位置对应的坐标
      const newPoint = pathElement.getPointAtLength(pointRelativeToPath); // get the point at the given length
      if (isFinite(newPoint.x) && isFinite(newPoint.y)) {
        console.log('newPoint', newPoint)
        // isSetPositionFlag.current = true;
        setPosition(newPoint);
      }
    } catch (error) {
      console.error("Error getting point at length:", error);
    }
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;

    const svgElement = svgRef.current;
    const pathElement = pathRef.current;
    if (!svgElement || !pathElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    // Get the mouse position relative to the SVG element
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    const pathLength = pathElement.getTotalLength();
    const closestLength = getClosestLengthOnPath(pathElement, mouseX, mouseY);
    setProportion(closestLength / pathLength);
    try {
      const newPoint = pathElement.getPointAtLength(closestLength);
      if (isFinite(newPoint.x) && isFinite(newPoint.y)) {
        // isSetPositionFlag.current = true;
        setPosition(newPoint);
      }
    } catch (error) {
      console.error("Error getting point at length:", error);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const getClosestLengthOnPath = (pathElement, x, y) => {
    // let closestLength = 0;
    // let closestDistance = Infinity;

    // 使用二分搜索来找到最近的点
    const binarySearch = (start, end, threshold) => {
      if (end - start < threshold) return (start + end) / 2;

      const mid = (start + end) / 2;
      const leftThird = (2 * start + end) / 3;
      const rightThird = (start + 2 * end) / 3;

      try {
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
      } catch (error) {
        console.error("Error in binary search:", error);
        return mid; // Return a fallback value
      }
    };

    return binarySearch(0, pathLength, 0.1);
  };

  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const generateRandomPath = () => {
    const width = 380;
    const height = 271;
    const points = [
      { x: 0, y: Math.random() * height },
      { x: Math.random() * width, y: Math.random() * height },
      { x: Math.random() * width, y: Math.random() * height },
      { x: width, y: Math.random() * height }
    ];

    const path = `M${points[0].x} ${points[0].y} ` +
                 `C${points[1].x} ${points[1].y}, ` +
                 `${points[2].x} ${points[2].y}, ` +
                 `${points[3].x} ${points[3].y}`;
    
    setPath(path);
  };

  return (
    <>
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
            d={path}
            strokeWidth="2"
            stroke="rgba(153,153,153,1)"
            fill="none"
          />
        </svg>
        {position && <div
          ref={divRef}
          className="absolute w-32 h-8 bg-blue-500 rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseDown={handleMouseDown}
        />}
      </div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={generateRandomPath}
      >
        Change Path
      </button>
    </>
  );
};

export default DraggableDivAlongSvgPath;