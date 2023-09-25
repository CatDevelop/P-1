import React from 'react';
import ReactFlow, {Background,} from 'reactflow';
import styled, {ThemeProvider} from 'styled-components';
import {darkTheme} from './theme';
import s from './SchemePreview.module.css'

import 'reactflow/dist/style.css';
import SquareNode from "./Nodes/SquareNode";
import CircleNode from "./Nodes/CircleNode";
import CustomNode from "./Nodes/CustomNode";
import BiDirEdge from "./Edges/BiDirEdge";


const nodeTypes = {
    custom: CustomNode,
    square: SquareNode,
    circle: CircleNode,
};

const edgeTypes = {
    bidir: BiDirEdge
};

const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => props.theme.bg};
  border-radius: 15px;
`;

const Flow = ({children, props}) => {
    const initialNodes = props.selectScheme.nodes;
    const initialEdges = props.selectScheme.edges;

    // const initialPreparedNodes = initialNodes.map(node => {
    //     if(node.type === "square")
    //         return {
    //             ...node,
    //             data: {...node.data},
    //         }
    //     else
    //         return {
    //             ...node,
    //             data: {...node.data},
    //         }
    // })
    //
    // const initialPreparedEdges = initialEdges.map(edge => {
    //     if(edge.type === "bidir")
    //         return {
    //             ...edge,
    //             data: {...edge.data},
    //         }
    //     else
    //         return {...edge}
    // })

    // const [nodes, setNodes, onNodesChange] = useNodesState(initialPreparedNodes);
    // const [edges, setEdges, onEdgesChange] = useEdgesState(initialPreparedEdges);

    return (
        <ReactFlowStyled
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{hideAttribution: true}}
            fitView
            connectionMode={"loose"}
            nodesFocusable={false}
            nodesConnectable={false}
            nodesDraggable={false}
            edgesFocusable={false}
            elementsSelectable={false}
        >
            <Background variant="dots" gap={12} size={1} color={"#4F4F53"}/>
            {children}
        </ReactFlowStyled>
    );
};

export default (props) => {
    return (
        <ThemeProvider theme={darkTheme}>
            <div className={s.previewContainer}>
                <Flow props={props}/>
            </div>

        </ThemeProvider>
    );
};
