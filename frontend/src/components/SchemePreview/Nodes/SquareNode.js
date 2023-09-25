import React, {memo} from 'react';
import {Handle, Position} from 'reactflow';
import styled from 'styled-components';
import {Form, Input} from 'antd'
import s from '../SchemePreview.module.css'
import classNames from 'classnames'

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

  //&:hover {
  //  .react-flow__handle {
  //    opacity: 1;
  //  }
  //}
`;



export default memo(props => {
    return (
        <Node selected={props.selected} >
            <div style={{height: "100%", boxSizing: "border-box"}}>
                {/*<Form name={"square"+props.id}>*/}
                    <Form.Item
                        name="text"
                        noStyle={true}
                    >
                        <TextArea disabled={true} className={classNames(s.squareTextarea, "nodrag", props.data.align === 0 ? s.left : props.data.align === 1 ? s.center : s.right)} value={props.data.label} onChange={e => props.data.onChange(e, props.id)} defaultValue={props.data.label} bordered={false}/>
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


