// /* eslint-disable max-depth */
// import { useState } from 'react';
// import AutoSizer from 'react-virtualized-auto-sizer';
// import { FixedSizeTree } from 'react-vtree';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from "@mui/material/Checkbox";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


// // document.body.style.margin = '0';
// // document.body.style.display = 'flex';
// // document.body.style.minHeight = '100vh';

// // const root = document.getElementById('root')!;
// // root.style.margin = '10px 0 0 10px';
// // root.style.flex = '1';


// // let nodeId = 0;

// // const createNode = (depth: number = 0) => {
// //   const node = {
// //     children: [],
// //     id: nodeId,
// //     name: `test-${nodeId}`,
// //   };

// //   nodeId += 1;

// //   if (depth === 5) {
// //     return node;
// //   }

// //   for (let i = 0; i < 10; i++) {
// //     node.children.push(createNode(depth + 1));
// //   }

// //   return node;
// // };

// // const rootNode = createNode();
// // const defaultTextStyle = { marginLeft: 10 };
// // const defaultButtonStyle = { fontFamily: 'Courier New' };


// const data = [
//   {
//     name: "A",
//     id: "a",
//     children: [
//       {
//         id: "a1",
//         name: "A-1",
//         children: [
//           { id: "a11", name: "A-1-1" },
//           { id: "a12", name: "A-1-2" },
//         ],
//       },
//       {
//         id: "a2",
//         name: "A-2",
//         children: [{ id: "a21", name: "A2-1" }],
//       },
//       {
//         id: "a3",
//         name: "A-3",
//         children: [
//           { id: "a31", name: "A-3-1" },
//           {
//             id: "a32",
//             name: "A-3-2",
//             children: [
//               { id: "a321", name: "A-3-2-1" },
//               { id: "a322", name: "A-3-2-2" },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "B",
//     id: "b",
//     children: [
//       {
//         id: "b1",
//         name: "B-1",
//         children: [
//           { id: "b11", name: "B-1-1" },
//           { id: "b12", name: "B-1-2" },
//         ],
//       },
//       {
//         id: "b2",
//         name: "B-2",
//         children: [{ id: "b21", name: "A2-1" }],
//       },
//       {
//         id: "b3",
//         name: "B-3",
//         children: [
//           { id: "b31", name: "B-3-1" },
//           {
//             id: "b32",
//             name: "B-3-2",
//             children: [
//               { id: "b321", name: "B-3-2-1" },
//               { id: "b322", name: "B-3-2-2" },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];


// const TreePresenter = ({ itemSize }) => {
//   const [chekcedLists, setCheckedLists] = useState([]);

//   // function* treeWalker(
//   //   refresh: boolean,
//   // ) {
//   //   const stack = [];
//   //   // debugger
//   //   // stack.push({
//   //   //   nestingLevel: 0,
//   //   //   node: rootNode,
//   //   // });

//   //   for (let i = rootNode.children.length - 1; i >= 0; i--) {
//   //     const node = rootNode.children[i];
//   //     // console.log('---node', node)
//   //     stack.push({
//   //       nestingLevel: 1,
//   //       node: rootNode.children[i],
//   //       children: node.children || []
//   //     });
//   //   }
//   //   while (stack.length !== 0) {
//   //     const { node, nestingLevel } = stack.pop()!;
//   //     const id = node.id.toString();

//   //     const isOpened = yield refresh
//   //       ? {
//   //         id,
//   //         isLeaf: node.children.length === 0,
//   //         isOpenByDefault: true,
//   //         name: node.name,
//   //         nestingLevel,
//   //         children: node.children || []
//   //       }
//   //       : id;

//   //     if (node.children.length !== 0 && isOpened) {
//   //       for (let i = node.children.length - 1; i >= 0; i--) {
//   //         stack.push({
//   //           nestingLevel: nestingLevel + 1,
//   //           node: node.children[i],
//   //           children: node.children[i].children || []
//   //         });
//   //       }
//   //     }
//   //   }
//   // }
//   function* treeWalker(refresh) {
//     const stack = [];
//     data.forEach((d) => {
//       stack.push({
//         nestingLevel: 0,
//         node: d,
//         children: d.children || []
//       });
//     });

//     while (stack.length !== 0) {
//       const { node, nestingLevel } = stack.pop();
//       const { name, id, children = [] } = node;

//       const isOpened = yield {
//         // The only difference VariableSizeTree `treeWalker` has comparing to
//         // the FixedSizeTree is the `defaultHeight` property in the data
//         // object.
//         // defaultHeight: 42,
//         isLeaf: children.length === 0,
//         // isOpenByDefault: false,
//         nestingLevel,
//         margin: nestingLevel * 20,
//         name,
//         id,
//         children
//       };

//       if (children.length !== 0 && isOpened) {
//         for (let i = children.length - 1; i >= 0; i--) {
//           stack.push({
//             nestingLevel: nestingLevel + 1,
//             node: children[i],
//             children: children[i].children || []
//           });
//         }
//       }
//     }
//   }
//   const Node = (props) => {
//     const { data, isOpen, style, toggle } = props;
//     console.log('---props', props)
//     const { isLeaf, name, id, nestingLevel, children } = data;
//     // debugger
//     const handleCheckboxChange = (e) => {
//       const checked = e.target.checked;
//       if (checked) {
//         const addCheckedIdList = []
//         getAddCheckedIdList(id, children, addCheckedIdList)
//         setCheckedLists((prevState) => [...prevState, ...addCheckedIdList]);
//       } else {
//         const cancelCheckedIdList = []
//         getCancelCheckedIdList(id, children, cancelCheckedIdList)
//         setCheckedLists((prevState) =>
//           prevState.filter((item) => !cancelCheckedIdList.includes(item))
//         );
//       }
//     };

//     const getAddCheckedIdList = (id, children, list) => {
//       list.push(id);
//       if (children.length > 0) {
//         children.forEach((item) => {
//           // list.push(item.id);
//           getAddCheckedIdList(item.id, item.children || [], list);
//         });
//       }
//     };

//     const getCancelCheckedIdList = (id, children, list) => {
//       list.push(id);
//       if (children.length > 0) {
//         children.forEach((item) => {
//           // list.push(item.id);
//           getCancelCheckedIdList(item.id, item.children || [], list);
//         });
//       }
//     }


//     const stopPropagation = (e) => e.stopPropagation();
//     return (
//       <div
//         style={{
//           ...style,
//           alignItems: 'center',
//           display: 'flex',
//           paddingLeft: nestingLevel * 30 + (isLeaf ? 48 : 0),
//           boxSizing: 'border-box'
//         }}
//       >
//         {!isLeaf && (
//           <div onClick={toggle}>
//             {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
//           </div>
//         )}
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={chekcedLists.includes(id)}
//               onChange={handleCheckboxChange}
//               name={name}
//               id={id}
//               color="primary"
//             />
//           }
//           label={name}
//           onClick={stopPropagation}
//         />
//       </div>
//     )
//   }
//   return (
//     <AutoSizer>
//       {({ width, height }) => (
//         <FixedSizeTree
//           treeWalker={treeWalker}
//           itemSize={itemSize}
//           height={height}
//           width={width}
//         >
//           {Node}
//         </FixedSizeTree>
//       )}
//     </AutoSizer>
//   )
// };

// const App = () => (<TreePresenter itemSize={50} />);

// export default App;