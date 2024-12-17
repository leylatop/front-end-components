import React, { useState, useRef } from 'react';

// 简化贝塞尔曲线的点
const simplifyPoints = (points, tolerance = 0.7) => {
  if (points.length < 3) return points;
  
  const result = [points[0]];
  let prev = points[0];
  
  for (let i = 1; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    
    // 计算点到线段的距离
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

// 生成平滑的SVG路径
const getSmoothPath = (points) => {
  if (points.length < 2) return '';
  
  const firstPoint = points[0];
  let path = `M ${firstPoint.x} ${firstPoint.y}`;
  
  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const cp1x = (current.x + next.x) / 2;
    const cp1y = (current.y + next.y) / 2;
    
    path += ` Q ${current.x} ${current.y}, ${cp1x} ${cp1y}`;
  }
  
  if (points.length > 1) {
    const lastPoint = points[points.length - 1];
    path += ` L ${lastPoint.x} ${lastPoint.y}`;
  }
  
  return path;
};

// 计算两点之间的角度
// const getAngle = (p1, p2, p3) => {
//   const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
//   const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
//   return Math.abs(angle1 - angle2);
// };

// // 优化后的简化点函数
// const simplifyPoints = (points, tolerance = 1) => {
//   if (points.length < 3) return points;
  
//   const result = [points[0]];
//   let prev = points[0];
  
//   for (let i = 1; i < points.length - 1; i++) {
//     const curr = points[i];
//     const next = points[i + 1];
    
//     // 计算点到线段的距离
//     const dx = next.x - prev.x;
//     const dy = next.y - prev.y;
//     const length = Math.sqrt(dx * dx + dy * dy);
    
//     // 如果线段长度为0，跳过距离计算
//     const d = length === 0 ? 0 : 
//       Math.abs(dy * curr.x - dx * curr.y + next.x * prev.y - next.y * prev.x) / length;
    
//     // 计算角度变化
//     const angle = i > 0 ? getAngle(points[i-1], curr, next) : 0;
    
//     // 当距离大于容差或角度变化大于阈值时保留该点
//     if (d > tolerance || angle > Math.PI / 8) {
//       result.push(curr);
//       prev = curr;
//     }
//   }
  
//   result.push(points[points.length - 1]);
//   return result;
// };

// // 优化后的平滑路径函数
// const getSmoothPath = (points) => {
//   if (points.length < 2) return '';
//   if (points.length === 2) {
//     return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
//   }
  
//   const firstPoint = points[0];
//   let path = `M ${firstPoint.x} ${firstPoint.y}`;
  
//   // 使用三次贝塞尔曲线来实现更平滑的效果
//   for (let i = 1; i < points.length - 2; i++) {
//     const current = points[i];
//     const next = points[i + 1];
//     const nextNext = points[i + 2];
    
//     // 计算控制点
//     const cp1x = current.x + (next.x - points[i-1].x) * 0.25;
//     const cp1y = current.y + (next.y - points[i-1].y) * 0.25;
//     const cp2x = next.x - (nextNext.x - current.x) * 0.25;
//     const cp2y = next.y - (nextNext.y - current.y) * 0.25;
    
//     path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
//   }
  
//   // 处理最后两个点
//   const lastPoint = points[points.length - 1];
//   const secondLastPoint = points[points.length - 2];
//   path += ` L ${lastPoint.x} ${lastPoint.y}`;
  
//   return path;
// };

const PencilTool = () => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
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
    
    // 简化并平滑路径
    const simplifiedPoints = simplifyPoints(currentPath);
    const pathData = getSmoothPath(simplifiedPoints);
    
    setPaths(prev => [...prev, pathData]);
    setCurrentPath([]);
    setIsDrawing(false);
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
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      >
        {/* 已完成的路径 */}
        {paths.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        
        {/* 当前正在绘制的路径 */}
        {currentPath.length > 0 && (
          <path
            d={getSmoothPath(currentPath)}
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