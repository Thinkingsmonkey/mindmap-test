import { useSelector, useDispatch } from "react-redux";
import { addCenterNode, addChildNode } from "./nodeSlice";

const NodeTest = () => {
  const nodeId = useSelector((state) => state.nodes);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(addCenterNode());
  };
  return (
    <>
      <p>
        <pre>{JSON.stringify(nodeId, null, 2)}</pre>
      </p>
      <button onClick={handleClick}>add</button>
      <button
        onClick={() => {
          dispatch(addChildNode({ parentId: 0 }));
        }}
      >
        add Child
      </button>
    </>
  );
};

export default NodeTest;
