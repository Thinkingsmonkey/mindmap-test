import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import * as nodeVariable from '../variable/nodeVariable'

import { useSelector, useDispatch } from "react-redux";
import { addChildNode, setNodeConnectors } from "../features/node/nodeSlice";


function Node({ id }) {
  const dispatch = useDispatch()
  const nodeTest = useSelector(state => state.nodes)

  const [input, setInput] = useState("");
  const [copy, setCopy] = useState(false);
  const [editStatus, setEditStatus] = useState(true);
  const [collapse, setCollapse] = useState("hidden");

  const myElementRef = useRef(null);

  const setConnectors = () => {
    if (!myElementRef.current) return;
    const rect = myElementRef.current.getBoundingClientRect();
    // const midpointTop = {
    //   x: rect.left + window.scrollX + rect.width / 2,
    //   y: rect.top + window.scrollY,
    // };
    // const midpointRight = {
    //   x: rect.left + window.scrollX + rect.width,
    //   y: rect.top + window.scrollY + rect.height / 2,
    // };
    // const midpointBottom = {
    //   x: rect.left + window.scrollX + rect.width / 2,
    //   y: rect.top + window.scrollY + rect.height,
    // };
    // const midpointLeft = {
    //   x: rect.left + window.scrollX,
    //   y: rect.top + window.scrollY + rect.height / 2,
    // };
    const serializableRect = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left
    };

    dispatch(setNodeConnectors({serializableRect, id}))
    // setNodes((prevNodes) => {
    //   return produce(prevNodes, (nodes) => {
    //     nodes.forEach((node, index) => {
    //       if (index === id) {
    //         node.id = id;
    //         node.connectors.top = midpointTop;
    //         node.connectors.right = midpointRight;
    //         node.connectors.bottom = midpointBottom;
    //         node.connectors.left = midpointLeft;
    //       }
    //     });
    //   });
    // });
  }

  useEffect(() => {
    setConnectors()
  },[collapse]);
  
  const addChild = () => {
    dispatch(addChildNode({parentId: id}))
    // const newNode = {...defaultNode, parent: id, id: nodes.length};
    // setNodes(prev => {
    //   const newNodes = prev.map((node, index) => {
    //     if (index === id) {
    //       return {
    //         ...node,
    //         children: [...node.children, prev.length]
    //       };
    //     }
    //     return node;
    //   });
    //   return [...newNodes, newNode];
    // });
  };

  return (
    <div
      ref={myElementRef}
      className="border-2 border-stone-300
    "
    >
      <div className="bg-gray-100 p-2">
        <button
          className="bg-gray-600 text-white p-2 rounded-md mr-2"
          onClick={addChild}
        >
          新增
        </button>
        <button
          className="bg-gray-600 text-white p-2 rounded-md mr-2"
          onClick={() => setEditStatus(editStatus ? false : true)}
        >
          眼睛
        </button>
        <button
          className="bg-gray-600 text-white p-2 rounded-md"
          onClick={() => {
            setCollapse(collapse === "block" ? "hidden" : "block")
            
          }}
        >
          收合
        </button>
        <input type="text" autoFocus className="p-2 mx-2" />
      </div>
      {editStatus ? (
        <textarea
          autoFocus
          className={`w-full h-[300px] text-lg p-5 focus:outline-none  ${collapse} `}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            // setNodes(nodes => nodes.map((node, index) => { 
            //   if (index !== id) return node
            //   return {...node, width: e.target.parentElement.offsetWidth < nodeVariable.MIN_WIDTH ? nodeVariable.MIN_WIDTH : e.target.parentElement.offsetWidth }
            // }))
          }}
          style={{ resize: "none" }}
        ></textarea>
      ) : (
        <Markdown
          className={`w-full h-[300px] text-lg overflow-auto p-5  ${collapse}`}
          children={input}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const content = String(children).replace(/\n$/, "");
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <div>
                  <div className="flex justify-between px-5 text-white text-xs items-center bg-[#2d2d2d] rounded-t-md overflow-hidden">
                    <p className="text-sm">Example code</p>
                    {copy ? (
                      <button className="text-base text-white">Copied!</button>
                    ) : (
                      <button
                        className="text-base text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(content);
                          setCopy(true);
                          setTimeout(() => {
                            setCopy(false);
                          }, 1000);
                        }}
                      >
                        Copy
                      </button>
                    )}
                  </div>
                  <SyntaxHighlighter
                    wrapLongLines={true}
                    {...rest}
                    children={content}
                    style={{
                      ...vscDarkPlus,
                      'code[class*="language-"]': {
                        ...vscDarkPlus['code[class*="language-"]'],
                        fontSize: "1rem",
                        marginTop: 0,
                      },
                      'pre[class*="language-"]': {
                        ...vscDarkPlus['pre[class*="language-"]'],
                        fontSize: "1rem",
                        fontWeight: "700",
                        marginTop: 0,
                      },
                    }}
                    language={match[1]}
                    PreTag="div"
                  />
                </div>
              ) : (
                <code {...rest} className={className + "text-base"}>
                  {children}
                </code>
              );
            },
          }}
        />
      )}
    </div>
  );
}

export default Node;
