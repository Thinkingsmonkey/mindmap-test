import { useEffect, useState } from "react";
import "./App.css";
import Node from "./components/Node";

function App() {
  const defaultNode = {
    id: null,
    width: 300,
    mediumTop: null,
    mediumRight: null,
    mediumBottom: null,
    mediumLeft: null,
  };
  const defaultLine = { from: null, to: null };

  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);

  const addNode = () => {
    setNodes([...nodes, defaultNode]);
    if (nodes.length < 1) return;
    setLines([...lines, defaultLine]);
  };
  // console.log(nodes);
  // console.log(lines);

  useEffect(() => {
    setLines((prevLines) =>
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

  return (
    <>
      <div className="w-full h-screen">
        <button onClick={addNode}>添加</button>
        <div className="relative h-full">
          {nodes.map((node, index) => (
            <div
              key={index}
              style={{
                left: `${index * 550}px`,
                bottom: `${index * 450}px`,
                minWidth: `${defaultNode.width}px`,
                maxWidth: "400px",
              }}
              className={`flex-shrink-0 absolute`}
            >
              <Node setNodes={setNodes} id={index} />
            </div>
          ))}
          {lines.map((line, index) => {
            if (
              !line.from ||
              !line.to ||
              !line.from.mediumRight ||
              !line.to.mediumLeft
            )
              return null;

            const x1 = line.from.mediumRight.x;
            const y1 = line.from.mediumRight.y;
            const x2 = line.to.mediumLeft.x;
            const y2 = line.to.mediumLeft.y;

            const minX = Math.min(x1, x2);
            const minY = Math.min(y1, y2);
            const width = Math.abs(x2 - x1);
            const height = Math.abs(y2 - y1);

            // 控制點
            const cx1 = x1 + width * 0.5;
            const cy1 = y1;
            const cx2 = cx1;
            const cy2 = y2;

            return (
              <svg
                className="absolute"
                style={{ transform: `translate(${minX}px, ${minY}px)` }}
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                key={index}
              >
                <path
                  d={`M ${x1 - minX} ${y1 - minY} C ${cx1 - minX} ${
                    cy1 - minY
                  }, ${cx2 - minX} ${cy2 - minY}, ${x2 - minX} ${y2 - minY}`}
                  stroke="black"
                  fill="none"
                />
              </svg>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
