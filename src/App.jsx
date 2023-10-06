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
  console.log(nodes);
  console.log(lines);

  return (
    <>
      <div className="relative">
        <button onClick={addNode}>添加</button>
        <div className="flex flex-nowrap">
          {nodes.map((node, index) => (
            <div
              key={index}
              style={{
                right: `${index * 350}px`,
                minWidth: `${defaultNode.width}px`,
                maxWidth: "400px",
              }}
              className={`flex-shrink-0 absolute`}
            >
              <Node
                setNodes={setNodes}
                id={index}
                setLines={setLines}
                lines={lines}
              />
            </div>
          ))}
          {nodes.map((node, index) => {
            if (index < 1) return;
            if (nodes[index + 1] !== undefined) {
              // return (
              //   <svg
              //     width="100%"
              //     height="100%"
              //     version="1.1"
              //     xmlns="http://www.w3.org/2000/svg"
              //     style={{position:"relative", zIndex: "1"}}
              //   >
              //     <rect width="100" height="100" style={{fill:"rgb(255,0,0)"}} />
              //   </svg>
              // );
              return <svg width="100%" height="100%" key={index}>
                <line
                  x1={lines[index -1].from.mediumRight.x}
                  y1={lines[index -1].from.mediumRight.y}
                  x2={lines[index -1].to.mediumLeft.x}
                  y2={lines[index -1].to.mediumLeft.y}
                  stroke="black"
                  stroke-width='2'
                />
              </svg>
            }
          })}

          {/* {lines.map((line, index) => line.from ? (<svg width="100%" height="100%" key={index}>
              <line
                x1={nodes.find(n => n.id === line.from).mediumRight.x}
                y1={nodes.find(n => n.id === line.from).mediumRight.y}
                x2={nodes.find(n => n.id === line.to).mediumLeft.x}
                y2={nodes.find(n => n.id === line.to).mediumLeft.y}
                stroke="black"
              />
            </svg>) : (null)
          )} */}
        </div>
      </div>
    </>
  );
}

export default App;

// lines.map((line, index) => (
//   <></>
// ) ? (
//   <></>
// ) : (
//   <></>
// )
// )
