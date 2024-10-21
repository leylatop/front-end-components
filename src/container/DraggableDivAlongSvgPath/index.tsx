import React, { useState, useRef, useEffect } from 'react';

const DraggableDivAlongSvgPath = () => {
  const [position, setPosition] = useState(null);
  const [pathSegments, setPathSegments] = useState([]);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const isDraggingRef = useRef(false);

  // 初始化时将路径分解为线段
  useEffect(() => {
    const pathElement = pathRef.current;
    if (!pathElement) return;

    // 将路径分解为多个点
    const segments = decomposePathToSegments(pathElement);
    setPathSegments(segments);
    
    // 初始化位置在路径中间
    const midSegment = segments[Math.floor(segments.length / 2)];
    if (midSegment) {
      const midPoint = {
        x: (midSegment.start.x + midSegment.end.x) / 2,
        y: (midSegment.start.y + midSegment.end.y) / 2
      };
      setPosition(midPoint);
    }
  }, []);

  // 将SVG路径分解为线段
  const decomposePathToSegments = (pathElement) => {
    const segments = [];
    const totalLength = pathElement.getTotalLength();
    const SEGMENT_LENGTH = 5; // 每段长度，可以调整精度
    
    let currentLength = 0;
    let prevPoint = pathElement.getPointAtLength(0);
    
    while (currentLength < totalLength) {
      currentLength += SEGMENT_LENGTH;
      if (currentLength > totalLength) currentLength = totalLength;
      
      const currentPoint = pathElement.getPointAtLength(currentLength);
      segments.push({
        start: { x: prevPoint.x, y: prevPoint.y },
        end: { x: currentPoint.x, y: currentPoint.y },
        length: SEGMENT_LENGTH,
        totalLength: currentLength
      });
      
      prevPoint = currentPoint;
      if (currentLength === totalLength) break;
    }
    
    return segments;
  };

  // 计算点到线段的投影点
  const projectPointOnLineSegment = (point, segment) => {
    const { start, end } = segment;
    
    // 计算线段向量
    const lineVectorX = end.x - start.x;
    const lineVectorY = end.y - start.y;
    
    // 计算点到线段起点的向量
    const pointVectorX = point.x - start.x;
    const pointVectorY = point.y - start.y;
    
    // 计算线段长度的平方
    const lineLengthSquared = lineVectorX * lineVectorX + lineVectorY * lineVectorY;
    
    // 如果线段长度为0，返回起点
    if (lineLengthSquared === 0) return start;
    
    // 计算投影比例
    let t = (pointVectorX * lineVectorX + pointVectorY * lineVectorY) / lineLengthSquared;
    
    // 限制投影点在线段上
    t = Math.max(0, Math.min(1, t));
    
    // 计算投影点坐标
    return {
      x: start.x + t * lineVectorX,
      y: start.y + t * lineVectorY,
      t: t,
      segment
    };
  };

  // 找到距离鼠标最近的线段及投影点
  const findClosestProjection = (mouseX, mouseY) => {
    let minDistance = Infinity;
    let closestProjection = null;
    
    pathSegments.forEach(segment => {
      const projection = projectPointOnLineSegment(
        { x: mouseX, y: mouseY },
        segment
      );
      
      const distance = Math.sqrt(
        Math.pow(mouseX - projection.x, 2) + 
        Math.pow(mouseY - projection.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestProjection = projection;
      }
    });
    
    return closestProjection;
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    // 找到最近的投影点
    const projection = findClosestProjection(mouseX, mouseY);
    if (projection) {
      setPosition({ x: projection.x, y: projection.y });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-[380px] h-[271px]">
      <svg
        ref={svgRef}
        width="1000"
        height="1000"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0"
      >
        <path
          ref={pathRef}
          d="M0 162 L0 14 Q0 0 14 0 L729 0 Q743 0 743 14 L743 39 Q743 53 729 53 L584 53 Q570 53 570 67 L570 199 Q570 213 556 213 L100 213 Q86 213 86 227 L86 268"
          strokeWidth="2"
          stroke="rgba(153,153,153,1)"
          fill="none"
        />
        {/* 可选：显示分段点，用于调试 */}
        {pathSegments.map((segment, index) => (
          <circle
            key={index}
            cx={segment.start.x}
            cy={segment.start.y}
            r="2"
            fill="rgba(255,0,0,0.2)"
          />
        ))}
      </svg>
      {position && (
        <div
          className="absolute w-32 h-8 bg-blue-500 rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseDown={handleMouseDown}
        >
          Drag me
        </div>
      )}
    </div>
  );
};

export default DraggableDivAlongSvgPath;