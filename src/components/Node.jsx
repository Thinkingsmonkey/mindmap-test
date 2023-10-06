import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
function Node({ setNodes, setLines, lines, id }) {
  const [input, setInput] = useState("");
  const [copy, setCopy] = useState(false);
  const [editStatus, setEditStatus] = useState(true);
  const [collapse, setCollapse] = useState("block");

  const myElementRef = useRef(null);
  useEffect(() => {
    if (!myElementRef.current) return;
    const rect = myElementRef.current.getBoundingClientRect();
    const mediumTop = {
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY,
    };
    const mediumRight = {
      x: rect.left + window.scrollX + rect.width,
      y: rect.top + window.scrollY + rect.height / 2,
    };
    const mediumBottom = {
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY + rect.height,
    };
    const mediumLeft = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY + rect.height / 2,
    };

    setNodes((prevNodes) => {
      const newNodes = produce(prevNodes, (nodes) => {
        nodes.forEach((node, index) => {
          if (index === id) {
            node.id = id;
            node.mediumTop = mediumTop;
            node.mediumRight = mediumRight;
            node.mediumBottom = mediumBottom;
            node.mediumLeft = mediumLeft;
          }
        });
      });
      newNodes.forEach((node, index) => {
        if (index < 1) return;
        setLines(prev => {
          const newLines = prev.map(line => line)
          newLines[index - 1].from = newNodes[index - 1];
          newLines[index - 1].to = newNodes[index];
          return newLines
        })
      });
      return newNodes;
    });
  }, []);
  return (
    <div
      ref={myElementRef}
      className="border-2 border-stone-300
    "
    >
      <div className="bg-gray-100 p-2">
        <button
          className="bg-gray-600 text-white p-2 rounded-md mr-2"
          onClick={() => setEditStatus(editStatus ? false : true)}
        >
          眼睛
        </button>
        <button
          className="bg-gray-600 text-white p-2 rounded-md"
          onClick={() => setCollapse(collapse === "block" ? "hidden" : "block")}
        >
          收合
        </button>
      </div>
      {editStatus ? (
        <textarea
          autoFocus
          className={`w-full h-[300px] text-lg p-5 focus:outline-none  ${collapse} `}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ resize: "none" }}
        ></textarea>
      ) : (
        <Markdown
          className={`h-[300px] text-lg overflow-auto p-4 w-full  ${collapse}`}
          children={input}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const content = String(children).replace(/\n$/, "");
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <div className="h-[500px]">
                  <div className="flex justify-between px-4 text-white text-xs items-center bg-[#2d2d2d] rounded-t-md overflow-hidden">
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
