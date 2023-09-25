import React from 'react';
import {BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, getStraightPath, useStore} from 'reactflow';
import {Dropdown, Tooltip} from "antd";
import s from '../SchemeEdit.module.css'
import {SmileOutlined} from "@ant-design/icons";

export const getSpecialPath = (
    {sourceX, sourceY, targetX, targetY},
    offset
) => {
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;

    return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset} ${targetX} ${targetY}`;
};

export default function BiDirEdge({
                                      source,
                                      target,
                                      sourceX,
                                      sourceY,
                                      targetX,
                                      targetY,
                                      sourcePosition,
                                      targetPosition,
                                      markerEnd, markerStart,
                                      type, selected, data, id
                                  }) {
    const isBiDirectionEdge = useStore((s) => {
        return s.edges.some((e) => (e.source === target && e.target === source) || (e.target === source && e.source === target));
    });

    const edgePathParams = {
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    };

    let path = '';
    let labelX, labelY;

    if (data.pathType === "default")
        [path, labelX, labelY] = getBezierPath(edgePathParams);
    else if (data.pathType === "straight")
        [path, labelX, labelY] = getStraightPath(edgePathParams);
    else if (data.pathType === "smoothstep")
        [path, labelX, labelY] = getSmoothStepPath(edgePathParams);


    // if (isBiDirectionEdge) {
    //     path = getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25);
    // } else {
    //
    // }

    console.log(labelX, labelY)

    const min = (a, b) => {
        if (a > b) return b
        return a
    }

    const max = (a, b) => {
        if (a > b) return a
        return b
    }

    const arrowTypeItems = [
        {
            key: '0',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12H4" stroke="#9C9C9C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>,
            label: (
                <>
                    Ненаправленная
                </>
            ),
            onClick: () => data.changeArrow(id, "0")
        },
        {
            key: '1',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8L21 12M21 12L17 16M21 12L3 12" stroke="#9C9C9C" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>,
            label: (
                <>
                    Однонаправленная
                </>
            ),
            onClick: () => data.changeArrow(id, "1")
        },
        {
            key: '2',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8L21 12M21 12L17 16M21 12L3 12M3 12L7 8M3 12L7 16" stroke="#9C9C9C" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
            </svg>,
            label: (
                <>
                    Двунаправленная
                </>
            ),
            onClick: () => data.changeArrow(id, "2")
        },
    ];

    const pathTypeItems = [
        {
            key: "straight",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.626 3H10.8757C10.2547 3 9.75066 3.50327 9.75066 4.12505C9.75066 4.74682 10.2547 5.25009 10.8757 5.25009H17.1602L3.32964 19.0799C2.89012 19.5187 2.89012 20.232 3.32964 20.6707C3.5494 20.8905 3.83741 21 4.12542 21C4.41343 21 4.70145 20.8905 4.92121 20.6707L18.751 6.84091V13.1254C18.751 13.7472 19.2551 14.2505 19.8761 14.2505C20.4971 14.2505 21.0011 13.7472 21.0011 13.1254V6.37514C21.0011 4.51431 19.4868 3 17.626 3Z" fill="#9C9C9C"/>
            </svg>,
            label: (
                <>
                    Прямая
                </>
            ),
            onClick: () => data.changePath(id, "straight")
        },
        {
            key: "smoothstep",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.3757 7H14.6256C14.0046 7 13.5006 7.50401 13.5006 8.12502C13.5006 8.74604 14.0046 9.25005 14.6256 9.25005H17.1599L12.7506 13.6594L9.66126 10.5701C8.8835 9.79231 7.61747 9.79231 6.83971 10.5701L3.32963 14.0794C2.89012 14.5189 2.89012 15.2307 3.32963 15.6702C3.76914 16.1097 4.48091 16.1097 4.92041 15.6702L8.24973 12.3409L11.339 15.4302C11.7283 15.8194 12.2383 16.0137 12.7498 16.0137C13.2613 16.0137 13.7713 15.8187 14.1606 15.4302L18.75 10.8408V13.3751C18.75 13.9961 19.254 14.5002 19.875 14.5002C20.496 14.5002 21 13.9961 21 13.3751V9.62505C21 8.17752 19.8232 7 18.3757 7Z" fill="#9C9C9C"/>
            </svg>,
            label: (
                <>
                    Шаговая
                </>
            ),
            onClick: () => data.changePath(id, "smoothstep")
        },
        {
            key: "default",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.125 18.5C12.5925 18.5 11.3273 13.6325 10.911 12.0327C10.344 9.851 9.357 7.25 7.875 7.25C6.57075 7.25 5.25 9.311 5.25 13.25C5.25 13.8717 4.746 14.375 4.125 14.375C3.504 14.375 3 13.8717 3 13.25C3 8.315 4.959 5 7.875 5C11.4075 5 12.6727 9.8675 13.089 11.4673C13.656 13.649 14.643 16.25 16.125 16.25C17.4292 16.25 18.75 14.189 18.75 10.25C18.75 9.62825 19.254 9.125 19.875 9.125C20.496 9.125 21 9.62825 21 10.25C21 15.185 19.041 18.5 16.125 18.5Z" fill="#9C9C9C"/>
            </svg>,
            label: (
                <>
                    Плавная
                </>
            ),
            onClick: () => data.changePath(id, "default")
        },
    ];

    return <>
        <BaseEdge path={path} markerEnd={markerEnd} markerStart={markerStart} style={{strokeWidth: "2px"}}/>
        <EdgeLabelRenderer>
            <div
                style={{
                    position: 'absolute',
                    // transform: `translate(-50%, -200%) translate(${labelX}px,${labelY}px)`,
                    // transform: `translate(${labelX}px,${labelY}px) translateY(${max(sourceY, targetY)}px)`,
                    transform: `translate(-50%, -50%) translate(${labelX}px,${min(sourceY - 30, targetY - 30)}px)`,
                    // transform: `translateX(${labelX-15}px) translateY(${min(sourceY-30, targetY-30)}px)`,
                    fontSize: 12,
                    zIndex: "100",
                    // top: "0px",
                    // left: "0px",
                    // everything inside EdgeLabelRenderer has no pointer events by default
                    // if you have an interactive element, set pointer-events: all
                    pointerEvents: 'all',
                }}
                className="nodrag nopan"
            >
                {
                    selected ?
                        <div className={s.edgeToolBar}>
                            <Tooltip placement="top" title={"Удалить"} arrow={false}>
                                <div className={s.tool} onClick={() => {
                                    data.reactFlowInstance.deleteElements({
                                        nodes: [],
                                        edges: [data.reactFlowInstance.getEdge(id)]
                                    })
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                                            stroke="#9C9C9C" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                    </svg>

                                    {/*<DeleteOutlined style={{color: "#F96057"}}/>*/}
                                </div>
                            </Tooltip>

                            <Tooltip placement="top" title={"Тип линии"} arrow={false}>
                                <div className={s.tool}>
                                    <Dropdown
                                        menu={{items: pathTypeItems, selectable: true, selectedKeys: [data.pathType]}}
                                        trigger={['click']}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M17.626 3H10.8757C10.2547 3 9.75066 3.50327 9.75066 4.12505C9.75066 4.74682 10.2547 5.25009 10.8757 5.25009H17.1602L3.32964 19.0799C2.89012 19.5187 2.89012 20.232 3.32964 20.6707C3.5494 20.8905 3.83741 21 4.12542 21C4.41343 21 4.70145 20.8905 4.92121 20.6707L18.751 6.84091V13.1254C18.751 13.7472 19.2551 14.2505 19.8761 14.2505C20.4971 14.2505 21.0011 13.7472 21.0011 13.1254V6.37514C21.0011 4.51431 19.4868 3 17.626 3Z"
                                                fill="#9C9C9C"/>
                                        </svg>
                                    </Dropdown>


                                    {/*<DeleteOutlined style={{color: "#F96057"}}/>*/}
                                </div>
                            </Tooltip>

                            <Tooltip placement="top" title={"Направление линии"} arrow={false}>
                                <div className={s.tool}>
                                    <Dropdown
                                        menu={{items: arrowTypeItems, selectable: true, selectedKeys: [data.arrowType]}}
                                        trigger={['click']}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            {
                                                data.arrowType === "0" ?
                                                    <path d="M20 12H4" stroke="#9C9C9C" stroke-width="2"
                                                          stroke-linecap="round" stroke-linejoin="round"/>
                                                    : data.arrowType === "1" ?
                                                        <path d="M17 8L21 12M21 12L17 16M21 12L3 12" stroke="#9C9C9C"
                                                              stroke-width="2" stroke-linecap="round"
                                                              stroke-linejoin="round"/>
                                                        :
                                                        <path d="M17 8L21 12M21 12L17 16M21 12L3 12M3 12L7 8M3 12L7 16"
                                                              stroke="#9C9C9C" stroke-width="2" stroke-linecap="round"
                                                              stroke-linejoin="round"/>
                                            }
                                        </svg>
                                    </Dropdown>


                                    {/*<DeleteOutlined style={{color: "#F96057"}}/>*/}
                                </div>
                            </Tooltip>

                            {/*<Button*/}
                            {/*    type="text"*/}
                            {/*    icon={<DeleteOutlined className={s.edgeTool}/>}*/}
                            {/*    onClick={() => {*/}
                            {/*        data.changePath(id)*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </div> : <></>
                }
            </div>
        </EdgeLabelRenderer>
    </>;
}
