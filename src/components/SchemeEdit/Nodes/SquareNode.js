import React, {memo, useState} from 'react';
import {Handle, NodeResizer, NodeToolbar, Position} from 'reactflow';
import styled from 'styled-components';
import {Button, Form, Input, Tooltip} from 'antd'
import s from '../SchemeEdit.module.css'
import classNames from 'classnames'
import {
    AlignCenterOutlined,
    AlignLeftOutlined,
    AlignRightOutlined,
    DeleteOutlined,
    FormatPainterOutlined
} from "@ant-design/icons";

const {TextArea} = Input;
const Node = styled.div`
  padding: 10px;
  height: 100%;
  border-radius: 5px;
  background: ${(props) => props.theme.nodeBg};
  color: ${(props) => props.theme.nodeColor};
  box-sizing: border-box;
  border: 1px solid ${(props) => (props.selected ? props.theme.primary : props.theme.nodeBorder)};

  .react-flow__handle {
    background: ${(props) => props.theme.primary};
    width: 8px;
    height: 10px;
    border-radius: 3px;
    opacity: 0;
  }

  &:hover {
    .react-flow__handle {
      opacity: 1;
    }
  }
`;



export default memo(props => {
    return (
        <Node selected={props.selected} >
            {/*<NodeToolbar isVisible={props.selected} position={Position.Top}>*/}
            {/*    */}
            {/*</NodeToolbar>*/}
            <NodeResizer color="#ff0071" isVisible={props.selected} minWidth={90} minHeight={45} maxHeight={1000} maxWidth={1000}/>

            {props.selected ? <div className={s.nodeToolBar}>
                <Tooltip placement="top" title={"Удалить"} arrow={false}>
                    <div className={s.nodeTool} onClick={() => {
                        props.data.reactFlowInstance.deleteElements({nodes: [props.data.reactFlowInstance.getNode(props.id)], edges: []})
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
                <Tooltip placement="top" title={"Выравнивание текста"} arrow={false}>
                    <div className={s.nodeTool} onClick={() => props.data.changeAlign(props.id)}>
                        {
                            props.data.align === 0 ? <AlignLeftOutlined /> : props.data.align === 1 ? <AlignCenterOutlined/> : <AlignRightOutlined/>
                        }
                    </div>
                </Tooltip>
                {/*<Button*/}
                {/*    type="text"*/}
                {/*    icon={<FormatPainterOutlined />}*/}
                {/*/>*/}
                {/*<Button*/}
                {/*    onClick={() => props.data.changeAlign(props.id)}*/}
                {/*    type="text"*/}
                {/*    icon={props.data.align === 0 ? <AlignLeftOutlined /> : props.data.align === 1 ? <AlignCenterOutlined/> : <AlignRightOutlined/>}*/}
                {/*/>*/}
            </div> : <></>}

            {/*<div>*/}
            <div style={{height: "100%", boxSizing: "border-box"}}>
                {/*<Form name={"square"+props.id}>*/}
                    <Form.Item
                        name="text"
                        noStyle={true}
                    >
                        <TextArea className={classNames(s.squareTextarea, "nodrag", props.data.align === 0 ? s.left : props.data.align === 1 ? s.center : s.right)} value={props.data.label} onChange={e => props.data.onChange(e, props.id)} defaultValue={props.data.label} bordered={false}/>
                    </Form.Item>

                {/*<strong>{data.label}</strong>*/}
                {/*</Form>*/}
            </div>
            <Handle type="source" position={Position.Top} id="top"/>
            <Handle type="source" position={Position.Right} id="right" />
            <Handle type="source" position={Position.Bottom} id="bottom" />
            <Handle type="source" position={Position.Left} id="left"/>
        </Node>
    );
});


