import { useEffect, useState, useRef } from "react";
import "./App.css";
import Node from "./components/Node";
import * as lineVariable from './variable/lineVariable'
import * as nodeVariable from './variable/nodeVariable'

function App() {
  const parentRef = useRef(null);
  let parentRect = null
  if (parentRef.current !== null) {
    parentRect = parentRef.current.getBoundingClientRect();
  }

  const defaultNode = {
    id: null,
    width: nodeVariable.MIN_WIDTH,
    parent: null,
    children:[],
    connectors: {
      top: null,
      right: null,
      bottom: null,
      left: null,
    }
  };
  const defaultLine = { from: null, to: null };

  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);

  const addNode = () => {
    setNodes([...nodes, defaultNode]);
    if (nodes.length < 1) return;
    setLines([...lines, defaultLine]);
  };
  console.log(nodes);
  // console.log(lines);

  useEffect(() => {
    setLines(() =>
      nodes
        .map((node, index) => {
          if (index < 1) return null;
          return {
            from: nodes[index - 1],
            to: node,
          };
        })
        .filter(Boolean)
    );
  }, [nodes]);

  const createLevelLine = () => {
    return lines.map((line, index) => {
      if (
        !line.from ||
        !line.to ||
        !line.from.connectors.right ||
        !line.to.connectors.left
      )
        return null;
      
      const startPoint = line.from.connectors.right
      const endPoint = line.to.connectors.left

      // path
      const startX = startPoint.x;
      const startY = startPoint.y;
      const endX = endPoint.x;
      const endY = endPoint.y;
      
      // viewbox
      const minX = Math.min(startX, endX);
      const minY = Math.min(startY, endY);
      const width = lineVariable.LINE_WIDTH;
      const height = Math.abs(endY - startY);
      
      // 控制點
      const controllStartX = startX + width * 0.5;
      const controllStartY = startY;
      const controllEndX = controllStartX;
      const controllEndY = endY;

      return (
        <svg
          className="absolute"
          style={{ transform: `translate(${minX - parentRect.x - window.scrollX}px, ${minY-5 - parentRect.y - window.scrollY}px)` }}
          viewBox={`${minX} ${minY-5} ${width} ${height + 10}`}
          width={width}
          height={height + 10}
          key={index}
        >
          <path
            
            d={startY - endY < 0 ? 
              `M ${minX + 8} ${minY} C ${controllStartX} ${
                controllStartY
              }, ${controllEndX} ${controllEndY}, ${startX +108} ${minY + height}` 
            :
              `M ${minX + 8} ${minY + height} C ${controllStartX} ${
              controllStartY
            }, ${controllEndX} ${controllEndY}, ${startX +108} ${minY}`}
            stroke="red"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      );
    })
  }

  return (
    <>
      <div className="w-full absolute top-20" ref={parentRef} >
          <button className="absolute top-14 z-10" onClick={addNode}>添加</button>
          {nodes.map((node, index) => (
            <div
              key={index}
              style={{
                left: `${index * (node.width + lineVariable.LINE_WIDTH)}px`,
                top: `${index * 450}px`,
                // width: `${node.width}px`,
                minWidth: `${defaultNode.width}px`,
                maxWidth: `${nodeVariable.MAX_WIDTH}`,
              }}
              className={`absolute `}
            >
              <Node setNodes={setNodes} id={index} nodes={nodes} setLines={setLines} />
            </div>
          ))}
          {createLevelLine()}
      </div>
    </>
  );
}

export default App;
