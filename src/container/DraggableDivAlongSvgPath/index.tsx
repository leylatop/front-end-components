import React, { useState, useRef, useEffect } from 'react';

const PathTypes = {
  LINE: 'line',
  BEZIER: 'bezier',
  ORTHOGONAL: 'orthogonal'
};

const DraggableDivAlongSvgPath = () => {
  // 状态管理
  const [position, setPosition] = useState(null);
  const [pathType, setPathType] = useState(PathTypes.ORTHOGONAL);
  const [pathSegments, setPathSegments] = useState([]);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 162 });
  const [endPoint, setEndPoint] = useState({ x: 86, y: 268 });
  const [textRelativePosition, setTextRelativePosition] = useState(0.5); // 文本在路径上的相对位置
  
  // Refs
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isDraggingStartRef = useRef(false);
  const isDraggingEndRef = useRef(false);

  // 根据路径类型生成路径数据
  const generatePathData = () => {
    switch (pathType) {
      case PathTypes.LINE:
        return `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
      
      case PathTypes.BEZIER:
        const controlPoint1 = {
          x: startPoint.x + (endPoint.x - startPoint.x) / 3,
          y: startPoint.y
        };
        const controlPoint2 = {
          x: startPoint.x + 2 * (endPoint.x - startPoint.x) / 3,
          y: endPoint.y
        };
        return `M ${startPoint.x} ${startPoint.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${endPoint.x} ${endPoint.y}`;
      
      case PathTypes.ORTHOGONAL:
        // 保持原有的正交路径逻辑，但使用动态的起点和终点
        return `M ${startPoint.x} ${startPoint.y} L ${startPoint.x} 14 Q ${startPoint.x} 0 14 0 L729 0 Q743 0 743 14 L743 39 Q743 53 729 53 L584 53 Q570 53 570 67 L570 199 Q570 213 556 213 L100 213 Q86 213 ${endPoint.x} 227 L ${endPoint.x} ${endPoint.y}`;
      
      default:
        return '';
    }
  };

  // 更新路径分段
  useEffect(() => {
    const pathElement = pathRef.current;
    if (!pathElement) return;
    
    const segments = decomposePathToSegments(pathElement);
    setPathSegments(segments);
    
    // 使用保存的相对位置更新文本位置
    updateTextPosition(textRelativePosition);
  }, [startPoint, endPoint, pathType]);

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

  // 更新文本位置
  const updateTextPosition = (relativePosition: number) => {
    const pathElement = pathRef.current;
    if (!pathElement) return;
    
    const totalLength = pathElement.getTotalLength();
    const targetLength = totalLength * relativePosition;
    const point = pathElement.getPointAtLength(targetLength);
    setPosition(point);
  };

  // 投影计算方法
  const projectPointOnLineSegment = (point, segment) => {
    const { start, end } = segment;
    const lineVectorX = end.x - start.x;
    const lineVectorY = end.y - start.y;
    const pointVectorX = point.x - start.x;
    const pointVectorY = point.y - start.y;
    const lineLengthSquared = lineVectorX * lineVectorX + lineVectorY * lineVectorY;
    
    if (lineLengthSquared === 0) return start;
    
    let t = (pointVectorX * lineVectorX + pointVectorY * lineVectorY) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t));
    
    return {
      x: start.x + t * lineVectorX,
      y: start.y + t * lineVectorY,
      t: t,
      segment
    };
  };

  // 找到最近的投影点
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

  // 文本拖拽事件处理
  const handleTextDragStart = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleTextDragMove);
    document.addEventListener('mouseup', handleTextDragEnd);
  };

  const handleTextDragMove = (e) => {
    if (!isDraggingRef.current) return;
    
    const svgElement = svgRef.current;
    const pathElement = pathRef.current;
    if (!svgElement || !pathElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    const projection = findClosestProjection(mouseX, mouseY);
    if (projection) {
      // 计算并保存相对位置
      const totalLength = pathElement.getTotalLength();
      const currentLength = projection.segment.totalLength - 
        projection.segment.length * (1 - projection.t);
      const relativePosition = currentLength / totalLength;
      setTextRelativePosition(relativePosition);
      setPosition({ x: projection.x, y: projection.y });
    }
  };

  const handleTextDragEnd = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleTextDragMove);
    document.removeEventListener('mouseup', handleTextDragEnd);
  };

  // 端点拖拽事件处理
  const handleEndpointDragStart = (point, isStart) => (e) => {
    e.preventDefault();
    if (isStart) {
      isDraggingStartRef.current = true;
    } else {
      isDraggingEndRef.current = true;
    }
    document.addEventListener('mousemove', handleEndpointDragMove);
    document.addEventListener('mouseup', handleEndpointDragEnd);
  };

  const handleEndpointDragMove = (e) => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    if (isDraggingStartRef.current) {
      setStartPoint({ x: mouseX, y: mouseY });
    } else if (isDraggingEndRef.current) {
      setEndPoint({ x: mouseX, y: mouseY });
    }
  };

  const handleEndpointDragEnd = () => {
    isDraggingStartRef.current = false;
    isDraggingEndRef.current = false;
    document.removeEventListener('mousemove', handleEndpointDragMove);
    document.removeEventListener('mouseup', handleEndpointDragEnd);
  };

  return (
    <div className="relative w-[380px] h-[271px]">
      <div className="mb-4 space-x-2" style={{ position: 'absolute', top: 400}}>
        <button
          className={`px-4 py-2 rounded ${pathType === PathTypes.LINE ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPathType(PathTypes.LINE)}
        >
          Line
        </button>
        <button
          className={`px-4 py-2 rounded ${pathType === PathTypes.BEZIER ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPathType(PathTypes.BEZIER)}
        >
          Bezier
        </button>
        <button
          className={`px-4 py-2 rounded ${pathType === PathTypes.ORTHOGONAL ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setPathType(PathTypes.ORTHOGONAL)}
        >
          Orthogonal
        </button>
      </div>
      
      <svg
        ref={svgRef}
        width="1000"
        height="400"
        viewBox="0 0 1000 400"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0"
      >
        {/* 主路径 */}
        <path
          ref={pathRef}
          d={generatePathData()}
          strokeWidth="2"
          stroke="rgba(153,153,153,1)"
          fill="none"
        />
        
        {/* 起点和终点的拖拽手柄 */}
        <circle
          cx={startPoint.x}
          cy={startPoint.y}
          r="6"
          fill="blue"
          cursor="move"
          onMouseDown={handleEndpointDragStart(startPoint, true)}
        />
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r="6"
          fill="red"
          cursor="move"
          onMouseDown={handleEndpointDragStart(endPoint, false)}
        />
      </svg>
      
      {/* 可拖拽的文本框 */}
      {position && (
        <div
          className="absolute w-32 h-8 bg-blue-500 rounded-full cursor-move transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transition: isDraggingRef.current ? 'none' : 'all 0.1s ease-out'
          }}
          onMouseDown={handleTextDragStart}
        >
          Drag me
        </div>
      )}
    </div>
  );
};

export default DraggableDivAlongSvgPath;