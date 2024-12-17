import React, { useState, useRef } from 'react';

// 简化贝塞尔曲线的点
const simplifyPoints = (points, tolerance = 2) => {
  if (points.length < 3) return points;
  
  const result = [points[0]];
  let prev = points[0];
  
  for (let i = 1; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const d = Math.abs(dy * curr.x - dx * curr.y + next.x * prev.y - next.y * prev.x) / 
              Math.sqrt(dx * dx + dy * dy);
              
    if (d > tolerance) {
      result.push(curr);
      prev = curr;
    }
  }
  
  result.push(points[points.length - 1]);
  return result;
};

// 创建带控制点的锚点
const createAnchorPoint = (point, prevPoint, nextPoint) => {
  const controlDistance = 30; // 控制点距离
  let angle = 0;

  if (prevPoint && nextPoint) {
    // 基于前后点计算角度
    angle = Math.atan2(nextPoint.y - prevPoint.y, nextPoint.x - prevPoint.x);
  } else if (prevPoint) {
    // 只有前点时基于前点计算
    angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
  } else if (nextPoint) {
    // 只有后点时基于后点计算
    angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
  }

  return {
    x: point.x,
    y: point.y,
    cp1: {
      x: point.x - Math.cos(angle) * controlDistance,
      y: point.y - Math.sin(angle) * controlDistance
    },
    cp2: {
      x: point.x + Math.cos(angle) * controlDistance,
      y: point.y + Math.sin(angle) * controlDistance
    }
  };
};

// 生成实时平滑路径
const getSmoothPathData = (points) => {
  if (points.length < 2) return '';
  
  const anchors = points.map((point, i) => 
    createAnchorPoint(
      point,
      points[i - 1],
      points[i + 1]
    )
  );

  let path = `M ${anchors[0].x} ${anchors[0].y}`;
  
  for (let i = 0; i < anchors.length - 1; i++) {
    const curr = anchors[i];
    const next = anchors[i + 1];
    path += ` C ${curr.cp2.x} ${curr.cp2.y}, ${next.cp1.x} ${next.cp1.y}, ${next.x} ${next.y}`;
  }
  
  return path;
};

const PencilTool = () => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPathIndex, setSelectedPathIndex] = useState(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [draggingElement, setDraggingElement] = useState(null);
  const svgRef = useRef(null);
  
  const getCoordinates = (event) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };
  
  const startDrawing = (event) => {
    if (selectedPathIndex !== null) return;
    const point = getCoordinates(event);
    setCurrentPath([point]);
    setIsDrawing(true);
  };
  
  const draw = (event) => {
    if (!isDrawing) return;
    const point = getCoordinates(event);
    setCurrentPath(prev => [...prev, point]);
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    const simplifiedPoints = simplifyPoints(currentPath);
    const anchors = simplifiedPoints.map((point, i) => 
      createAnchorPoint(
        point,
        simplifiedPoints[i - 1],
        simplifiedPoints[i + 1]
      )
    );
    
    setPaths(prev => [...prev, { anchors }]);
    setCurrentPath([]);
    setIsDrawing(false);
  };
  
  const startDragging = (event, pathIndex, pointIndex, element) => {
    event.stopPropagation();
    setSelectedPathIndex(pathIndex);
    setSelectedPointIndex(pointIndex);
    setDraggingElement(element);
  };
  
  const drag = (event) => {
    if (draggingElement === null || selectedPathIndex === null || selectedPointIndex === null) return;
    
    const point = getCoordinates(event);
    setPaths(prev => {
      const newPaths = [...prev];
      const path = {...newPaths[selectedPathIndex]};
      const anchors = [...path.anchors];
      const anchor = {...anchors[selectedPointIndex]};
      
      if (draggingElement === 'point') {
        const dx = point.x - anchor.x;
        const dy = point.y - anchor.y;
        
        // 移动锚点时同时移动控制点
        anchor.x = point.x;
        anchor.y = point.y;
        anchor.cp1.x += dx;
        anchor.cp1.y += dy;
        anchor.cp2.x += dx;
        anchor.cp2.y += dy;
      } else if (draggingElement === 'cp1') {
        anchor.cp1 = point;
      } else if (draggingElement === 'cp2') {
        anchor.cp2 = point;
      }
      
      anchors[selectedPointIndex] = anchor;
      path.anchors = anchors;
      newPaths[selectedPathIndex] = path;
      return newPaths;
    });
  };
  
  const stopDragging = () => {
    setDraggingElement(null);
  };
  
  const selectPath = (event, index) => {
    event.stopPropagation();
    setSelectedPathIndex(index);
    setSelectedPointIndex(null);
  };
  
  const clearSelection = () => {
    setSelectedPathIndex(null);
    setSelectedPointIndex(null);
  };

  return (
    <div className="w-full max-w-4xl border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">SVG Pencil Tool</h2>
      </div>
      
      <svg
        ref={svgRef}
        className="w-full h-96 bg-white"
        onMouseDown={startDrawing}
        onMouseMove={(e) => {
          draw(e);
          drag(e);
        }}
        onMouseUp={() => {
          stopDrawing();
          stopDragging();
        }}
        onMouseLeave={() => {
          stopDrawing();
          stopDragging();
        }}
        onClick={clearSelection}
      >
        {/* 已完成的路径 */}
        {paths.map((path, pathIndex) => (
          <g key={pathIndex}>
            <path
              d={getSmoothPathData(path.anchors.map(a => ({ x: a.x, y: a.y })))}
              fill="none"
              stroke={selectedPathIndex === pathIndex ? "blue" : "black"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={(e) => selectPath(e, pathIndex)}
            />
            
            {/* 选中路径时显示控制点 */}
            {selectedPathIndex === pathIndex && path.anchors.map((anchor, anchorIndex) => (
              <g key={anchorIndex}>
                {/* 锚点 */}
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r="4"
                  fill="blue"
                  onMouseDown={(e) => startDragging(e, pathIndex, anchorIndex, 'point')}
                />
                
                {/* 控制点1和手柄 */}
                <line
                  x1={anchor.x}
                  y1={anchor.y}
                  x2={anchor.cp1.x}
                  y2={anchor.cp1.y}
                  stroke="gray"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle
                  cx={anchor.cp1.x}
                  cy={anchor.cp1.y}
                  r="3"
                  fill="red"
                  onMouseDown={(e) => startDragging(e, pathIndex, anchorIndex, 'cp1')}
                />
                
                {/* 控制点2和手柄 */}
                <line
                  x1={anchor.x}
                  y1={anchor.y}
                  x2={anchor.cp2.x}
                  y2={anchor.cp2.y}
                  stroke="gray"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle
                  cx={anchor.cp2.x}
                  cy={anchor.cp2.y}
                  r="3"
                  fill="red"
                  onMouseDown={(e) => startDragging(e, pathIndex, anchorIndex, 'cp2')}
                />
              </g>
            ))}
          </g>
        ))}
        
        {/* 当前正在绘制的路径 */}
        {currentPath.length > 0 && (
          <path
            d={getSmoothPathData(currentPath)}
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
};

export default PencilTool;