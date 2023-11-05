import { useEffect, useState, useRef } from "react";
import "./App.css";
import Node from "./components/Node";
import * as lineVariable from "./variable/lineVariable";
import * as nodeVariable from "./variable/nodeVariable";
import { produce } from "immer";
import _ from "lodash";
import NodeTest from "./features/node/NodeTest";
import { useSelector, useDispatch } from "react-redux";
import { addCenterNode } from "./features/node/nodeSlice";

function App() {
  const nodes = useSelector(state => state.nodes)
  const dispatch = useDispatch()
  const horizontalSpacing = nodeVariable.HORIZONTAL_SPACING;
  const verticalSpacing = nodeVariable.VERTICAL_SPACING;

  const parentRef = useRef(null);
  let parentRect = null;
  if (parentRef.current !== null) {
    parentRect = parentRef.current.getBoundingClientRect();
  }

  // const defaultNode = {
  //   id: 0,
  //   width: nodeVariable.MIN_WIDTH,
  //   height: nodeVariable.MIN_HEIGHT,
  //   parent: null,
  //   children: [],
  //   top: "50%",
  //   left: 0,
  //   display: "none",
  //   connectors: {
  //     top: null,
  //     right: null,
  //     bottom: null,
  //     left: null,
  //   },
  // };
  const defaultLine = { from: null, to: null };

  // const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);

  const addNode = () => {
    dispatch(addCenterNode())
    // setNodes([...nodes, { ...defaultNode, id: nodes.length }]);
    // if (nodes.length < 1) return;
    setLines([...lines, defaultLine]);
  };

  useEffect(() => {
    setLines(() =>
      nodes
        .map((node, index) => {
          if (index < 1) return null;
          const parentId = node.parent;
          return {
            from: nodes[parentId],
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

      const startPoint = line.from.connectors.right;
      const endPoint = line.to.connectors.left;

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
          style={{
            transform: `translate(${minX - parentRect.x - window.scrollX}px, ${
              minY - 5 - parentRect.y - window.scrollY
            }px)`,
          }}
          viewBox={`${minX} ${minY - 5} ${width} ${height + 10}`}
          width={width}
          height={height + 10}
          key={index}
        >
          <path
            d={
              startY - endY < 0
                ? `M ${
                    minX + 8
                  } ${minY} C ${controllStartX} ${controllStartY}, ${controllEndX} ${controllEndY}, ${
                    startX + 108
                  } ${minY + height}`
                : `M ${minX + 8} ${
                    minY + height
                  } C ${controllStartX} ${controllStartY}, ${controllEndX} ${controllEndY}, ${
                    startX + 108
                  } ${minY}`
            }
            stroke="red"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      );
    });
  };

  // console.log(nodes);
  // console.log(lines);

  // top
  const setNodeTop = (draftNodes, nodeId, currentTop) => {
    const node = draftNodes[nodeId];
    const childrenHeight = getChildrenHeight(node);
    node.top = currentTop + childrenHeight / 2 - node.height / 2;
    
    let nextTopForChild = currentTop; // 用於子節點的初始位置

    if (node.children.length !== 0) {
      nextTopForChild = node.children.reduce((accTop, id) => {
        console.log("accTop", accTop);
        const nextSiblingTop = setNodeTop(draftNodes, id, accTop);
        return nextSiblingTop; // 設定下一個兄弟節點的top值
      }, currentTop);
    }

    const nextSiblingTop = currentTop + childrenHeight + verticalSpacing;
    return nextSiblingTop;
  };

  const getChildrenHeight = (node, targetId = 0) => {
    let childrenHeight = 0;
    let stopId = node.id;
    if (node.children.length !== 0) {
      const childrenNodeHeight = node.children
        .map((id) => getChildrenHeight(nodes[id]))
        .reduce((cv, height) => cv + height, 0);
      childrenHeight =
        childrenNodeHeight + (node.children.length - 1) * verticalSpacing;
    } else {
      childrenHeight = node.height;
    }
    if (node.height > childrenHeight) {
      if (stopId === targetId) {
        return childrenHeight;
      }
      return node.height;
    }
    return childrenHeight;
  };

  const setNodeLeft = (node, nodes) => {
    let left = 0;

    // left
    if (node.parent !== null) {
      const parentNode = nodes[node.parent];
      setNodeLeft(parentNode, nodes);
      left = parentNode.left + parentNode.width + horizontalSpacing;
    } else {
      left = node.left;
    }
    return left;
  };

  useEffect(() => {
    if (nodes.length === 0) return;

    const updatedNodes = produce(nodes, (newNodes) => {
      return newNodes.map((node) => {
        const left = setNodeLeft(node, nodes);
        return { ...node, left, display: "block" };
      });
    });

    const initialTopValue = - getChildrenHeight(updatedNodes[0]) / 2;
    const newNodes = produce(updatedNodes, (draftNodes) => {
      setNodeTop(draftNodes, 0, initialTopValue);
    });3
    if (!_.isEqual(nodes, newNodes)) {
      setNodes(newNodes);
    }
  }, [nodes]);

  return (
    <>
      <NodeTest />
      <div className="w-full absolute top-1/2" ref={parentRef}>
        <button className="absolute top-14 z-10" onClick={addNode}>
          添加
        </button>
        {nodes.map((node, index) => {
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                display: node.display,
                top: `${node.top}px`,
                left: `${node.left}px`,
                height: `${nodeVariable.MIN_HEIGHT}px`,
                minWidth: `${nodeVariable.MIN_WIDTH}px`,
                maxWidth: `${nodeVariable.MAX_WIDTH}px`,
              }}
            >
              <Node
                // setNodes={setNodes}
                id={index}
                setLines={setLines}
                // defaultNode={defaultNode}
              />
            </div>
          );
        })}
        {createLevelLine()}
      </div>
    </>
  );
}

export default App;
