import { createSlice } from "@reduxjs/toolkit";
import * as nodeVariable from "../../variable/nodeVariable";

const initialState = []

const defaultNode = {
  id: 0,
  width: nodeVariable.MIN_WIDTH,
  height: nodeVariable.MIN_HEIGHT,
  parent: null,
  children: [],
  top: "50%",
  left: 0,
  display: "none",
  connectors: {
    top: null,
    right: null,
    bottom: null,
    left: null,
  },
};

export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    addCenterNode: (state) => {
      state.push(defaultNode)
    },
    addChildNode: (state, action) => {
      const parentId = action.payload.parentId;
      const newNode = {...defaultNode, parent: parentId, id: state.length};
      console.log(parentId);
      const parent = state.find(node => node.id === parentId);
      if (parent) {
        parent.children.push(state.length);
      }

      state.push(newNode);
    },
    setNodeConnectors: (state, action) => {
      const rect = action.rect
      const id = action.id
      const node = state.find(node => node.id = id)
      const midpointTop = {
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY,
      };
      const midpointRight = {
        x: rect.left + window.scrollX + rect.width,
        y: rect.top + window.scrollY + rect.height / 2,
      };
      const midpointBottom = {
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height,
      };
      const midpointLeft = {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY + rect.height / 2,
      };

      // state.forEach((node, index) => {
      //   if (index === id) {
      //     node.id = id;
          node.connectors.top = midpointTop;
          node.connectors.right = midpointRight;
          node.connectors.bottom = midpointBottom;
          node.connectors.left = midpointLeft;
      //   }
      // });

    }
  }
})

export const { addCenterNode,  addChildNode, setNodeConnectors} = nodeSlice.actions;

export default nodeSlice.reducer;