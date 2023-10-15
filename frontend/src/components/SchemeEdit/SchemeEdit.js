import React, {useCallback, useEffect, useRef} from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    MarkerType,
    Panel,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from 'reactflow';
import styled, {ThemeProvider} from 'styled-components';
import {darkTheme} from './theme';
import CustomNode from './Nodes/CustomNode';
import SquareNode from './Nodes/SquareNode';
import CircleNode from './Nodes/CircleNode';
import s from './SchemeEdit.module.css'
import 'reactflow/dist/style.css';
import {App, FloatButton} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {v4 as uuidv4} from 'uuid';
import SchemeSideBar from "../SchemeSideBar/SchemeSideBar";
import BiDirEdge from './Edges/BiDirEdge'
import {useDispatch} from "react-redux";
import {getScheme, updateScheme} from "../../store/slices/schemeSlice";
import {SchemeName} from "../Schemes/SchemeEditor/SchemeName/SchemeName";

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

const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

const saveFlow = (nodes, edges) => {
    const exportNodes = nodes.map(node => {
        return {
            id: node.id,
            type: node.type,
            position: node.position,
            width: node.width,
            height: node.height,
            data: node.data,
        }
    })
    return {
        nodes: exportNodes,
        edges: edges
    }
}

const Flow = ({children, props}) => {
    const dispatch = useDispatch()
    const {message} = App.useApp();

    const onChange = (event, id) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const label = event.target.value;

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label,
                            style: {width: node.width, height: node.height}
                        },
                    };
                } else
                    return node;

            })
        );
    };

    const changeAlign = (id) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const align = (node.data.align + 1) % 3;

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            align,
                            style: {width: node.width, height: node.height}
                        },
                    };
                } else
                    return node;

            })
        );
    }

    const changePath = (id, path) => {
        setEdges((edg) =>
            edg.map((edge) => {
                if (edge.id === id) {
                    let pathType = path;
                    // if(edge.data.pathType === "default")
                    //     pathType = "straight"
                    // else if(edge.data.pathType === "straight")
                    //     pathType = "smoothstep"
                    // else if(edge.data.pathType === "smoothstep")
                    //     pathType = "default"

                    return {
                        ...edge,
                        data: {
                            ...edge.data,
                            pathType
                        },
                    };
                } else
                    return edge;

            })
        );
    }

    const changeArrow = (id, arrow) => {
        setEdges((edg) =>
            edg.map((edge) => {
                if (edge.id === id) {
                    let markerStart, markerEnd;
                    if (arrow === "0") {
                        markerStart = {};
                        markerEnd = {};
                    } else if (arrow === "1") {
                        markerStart = {};
                        markerEnd = {type: MarkerType.ArrowClosed};
                    } else if (arrow === "2") {
                        markerStart = {type: MarkerType.ArrowClosed, orient: 'auto-start-reverse',};
                        markerEnd = {type: MarkerType.ArrowClosed};
                    }

                    return {
                        ...edge,
                        markerEnd,
                        markerStart,
                        data: {
                            ...edge.data,
                            arrowType: arrow
                        },
                    };
                } else
                    return edge;

            })
        );
    }

    const reactFlowInstance = useReactFlow();

    const initialPreparedNodes = props.scheme.nodes.map(node => {
        if (node.type === "square")
            return {
                ...node,
                data: {...node.data, onChange, changeAlign, reactFlowInstance},
            }
        else if (node.type === "circle")
            return {
                ...node,
                data: {...node.data, onChange, changeAlign, reactFlowInstance},
            }
        else
            return {
                ...node,
                data: {...node.data, onChange, reactFlowInstance},
            }
    })

    const initialPreparedEdges = props.scheme.edges.map(edge => {
        if (edge.type === "bidir")
            return {
                ...edge,
                data: {...edge.data, reactFlowInstance, changePath, changeArrow},
            }
        else
            return {...edge}
    })


    const reactFlowWrapper = useRef(null);


    const [nodes, setNodes, onNodesChange] = useNodesState(initialPreparedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialPreparedEdges);

    const handleSave = () => {
        let saveNodes = [...nodes]
        let saveEdges = [...edges]
        saveNodes.map(node => {
            delete node.selected
            delete node.dragging
            delete node.resizing
        })
        saveEdges.map(edge => {
            delete edge.selected
        })
        message.loading({content: 'Схема сохраняется на сервер...', key: "saveScheme"});
        dispatch(updateScheme({scheme: JSON.stringify({nodes: saveNodes, edges: saveEdges}), schemeID: props.schemeID}))
            .then(() => {
                message.success({content: 'Схема успешно сохранена!', key: "saveScheme"});
                dispatch(getScheme(props.schemeID))
            }, () => {
                message.error({content: 'Ошибка обновления схемы!', key: "saveScheme"});
            })
    }

    const handleKeyDown = (e) => {
        console.log(e)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            handleSave(nodes, edges)
            return false;
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [nodes, edges])

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(
        {
            ...params,
            type: 'bidir',
            id: `${params.source}_${params.sourceHandle}->${params.target}_${params.targetHandle}`,
            data: {pathType: "default", arrowType: "1", reactFlowInstance, changePath, changeArrow},
            markerEnd: {type: MarkerType.ArrowClosed,},
        }, eds)), []);

    const onNodesDelete = useCallback(
        (deleted) => {
            console.log(deleted)
            setEdges(
                deleted.reduce((acc, node) => {
                    const incomers = getIncomers(node, nodes, edges);
                    const outgoers = getOutgoers(node, nodes, edges);
                    const connectedEdges = getConnectedEdges([node], edges);

                    const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

                    const createdEdges = incomers.flatMap(({id: source}) =>
                        outgoers.map(({id: target}) => ({
                            id: `${source}->${target}`,
                            source,
                            target,
                            type: "bidir",
                            data: {pathType: "default", arrowType: "1", reactFlowInstance, changePath, changeArrow},
                            markerEnd: {type: MarkerType.ArrowClosed,}
                        }))
                    );

                    return [...remainingEdges, ...createdEdges];
                }, edges)
            );
        },
        [nodes, edges]
    );


    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: "node_" + uuidv4(),
                type,
                position,
                data: {label: `${type} node`},
            };

            if (type === "square") {
                newNode.data = {label: "", align: 1, onChange, changeAlign, reactFlowInstance}
                newNode.style = {width: 105, height: 105}
            }

            if (type === "circle") {
                newNode.data = {label: "", align: 1, onChange, changeAlign, reactFlowInstance}
                newNode.style = {width: 105, height: 105}
            }

            if (type === "custom") {
                newNode.data = {label: "ПИН-КОД", onChange, reactFlowInstance}
            }


            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    return (
        <ReactFlowStyled
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={onNodesDelete}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{hideAttribution: true}}
            fitView
            snapGrid={[15, 15]}
            snapToGrid={true}
            onDrop={onDrop}
            onDragOver={onDragOver}
            ref={reactFlowWrapper}
            connectionMode={"loose"}
        >
            {/*<ControlsStyled/>*/}
            <Background variant="dots" gap={15} size={1} color={"#4F4F53"}/>
            {children}
            <Panel position={"top-right"}>
                <SchemeSideBar/>
            </Panel>
            <Panel position={"top-left"}>
                <SchemeName title={props.title}/>
            </Panel>
            <FloatButton icon={<SaveOutlined/>} onClick={() => {
                console.log("TEST SAVE BUTTON", saveFlow(nodes, edges), nodes)
                handleSave()
            }}/>
        </ReactFlowStyled>
    );
};

export default (props) => {
    return (
        <ThemeProvider theme={darkTheme}>
            <ReactFlowProvider>
                <div className={s.previewContainer}>
                    <Flow props={props}/>
                </div>
            </ReactFlowProvider>
        </ThemeProvider>
    );
};
