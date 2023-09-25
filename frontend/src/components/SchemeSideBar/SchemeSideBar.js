import React from 'react';
import s from './SchemeSideBar.module.css'
import classNames from 'classnames'

export default () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className={s.sideBar}>
            <div className={s.description}>Фигуры</div>
            <div className={s.squareNodeContainer} onDragStart={(event) => onDragStart(event, 'square')} draggable>
                <div className={s.squareNode}>
                    <div className={classNames(s.squareNodeConnector, s.connectorTop)}/>
                    <div className={classNames(s.squareNodeConnector, s.connectorLeft)}/>
                    <div className={classNames(s.squareNodeConnector, s.connectorBottom)}/>
                    <div className={classNames(s.squareNodeConnector, s.connectorRight)}/>
                </div>
            </div>
            <div className={s.input} onDragStart={(event) => onDragStart(event, 'custom')} draggable>
                <div className={s.customNode}>
                    <div className={classNames(s.squareNodeConnector, s.connectorLeft)}/>
                    <div className={classNames(s.squareNodeConnector, s.connectorRight)}/>
                </div>
            </div>

            <div className={s.circleNodeContainer} onDragStart={(event) => onDragStart(event, 'circle')} draggable>
                <div className={s.circleNode}>
                    <div className={classNames(s.squareNodeConnector, s.connectorTop)}/>
                    <div className={classNames(s.squareNodeConnector, s.connectorLeft)}/>
                    <div className={classNames(s.squareNodeConnector, s.connectorBottom)}/>
                    <div className={classNames(s.squareNodeConnector, s.connectorRight)}/>
                </div>
            </div>
        </div>
    );
};
