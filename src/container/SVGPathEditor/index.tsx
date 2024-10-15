import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';

const SVGPathEditor = () => {
  const [rx, setRx] = useState(50);
  const [ry, setRy] = useState(50);
  const [rotation, setRotation] = useState(0);
  const [largeArc, setLargeArc] = useState(0);
  const [sweep, setSweep] = useState(0);

  const pathData = `M 50,100 A ${rx},${ry} ${rotation} ${largeArc},${sweep} 200,100`;

  return (
    <div className="p-4 border rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Interactive SVG Path Editor</h2>
      <svg viewBox="0 0 250 200" className="w-full h-48 mb-4">
        <path d={pathData} fill="none" stroke="blue" strokeWidth="2" />
        <circle cx="50" cy="100" r="3" fill="red" />
        <circle cx="200" cy="100" r="3" fill="red" />
      </svg>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">rx: {rx}</label>
          <Slider value={[rx]} onValueChange={([value]) => setRx(value)} min={10} max={100} step={1} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ry: {ry}</label>
          <Slider value={[ry]} onValueChange={([value]) => setRy(value)} min={10} max={100} step={1} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rotation: {rotation}°</label>
          <Slider value={[rotation]} onValueChange={([value]) => setRotation(value)} min={0} max={360} step={1} />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="largeArc"
            checked={largeArc === 1}
            onChange={(e) => setLargeArc(e.target.checked ? 1 : 0)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label htmlFor="largeArc" className="text-sm font-medium">Large Arc</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sweep"
            checked={sweep === 1}
            onChange={(e) => setSweep(e.target.checked ? 1 : 0)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label htmlFor="sweep" className="text-sm font-medium">Sweep</label>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-mono bg-gray-100 p-2 rounded">
          Path: {pathData}
        </p>
      </div>
    </div>
  );
};

export default SVGPathEditor;
