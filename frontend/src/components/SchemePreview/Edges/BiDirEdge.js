import React from 'react';
import {BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath, getStraightPath, useStore} from 'reactflow';
import {Dropdown, Tooltip} from "antd";
import s from '../SchemePreview.module.css'
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

    return <>
        <BaseEdge path={path} markerEnd={markerEnd} markerStart={markerStart} style={{strokeWidth: "2px"}}/>
    </>;
}
