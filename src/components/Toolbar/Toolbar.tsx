import React from 'react';
import cl from "./Toolbar.module.scss";
import Brush from "../../tools/Brush";
import {useAppDispatch, useAppSelector} from "../../utils/redux";
//Reducers
import {toolReducer} from "../../reducers/tool-reducer";
import Rect from "../../tools/Rect";
import Circle from "../../tools/Circle";
import Eraser from "../../tools/Eraser";
import Line from "../../tools/Line";
//Actions
const {setTool, setLineWidth, setFillColor, setStrokeColor} = toolReducer.actions;

const Toolbar = () => {
    const dispatch = useAppDispatch();
    const canvas = useAppSelector(state => state.canvasReducer.canvas);
    const socket = useAppSelector(state => state.canvasReducer.socket);
    const sessionId = useAppSelector(state => state.canvasReducer.sessionId);

    const changeColor = (color: string) => {
        dispatch(setFillColor(color))
        dispatch(setStrokeColor(color))
    }

    return (
        <div className={cl.toolbar}>
            <input type="color" onChange={event => changeColor(event.target.value)}/>
            <div className={cl.toolbar_tools}>
                <div className={cl.toolbar_tools_item} onClick={() => dispatch(setTool(new Brush(canvas, socket, sessionId)))}>
                    <div className={cl.item_title}>Карандаш</div>
                </div>
                <div className={cl.toolbar_tools_item} onClick={() => dispatch(setTool(new Rect(canvas, socket, sessionId)))}>
                    <div className={cl.item_title}>Прямоугольник</div>
                </div>
                <div className={cl.toolbar_tools_item} onClick={() => dispatch(setTool(new Circle(canvas, socket, sessionId)))}>
                    <div className={cl.item_title}>Окружность</div>
                </div>
                <div className={cl.toolbar_tools_item} onClick={() => dispatch(setTool(new Eraser(canvas, socket, sessionId)))}>
                    <div className={cl.item_title}>Ластик</div>
                </div>
                <div className={cl.toolbar_tools_item} onClick={() => dispatch(setTool(new Line(canvas, socket, sessionId)))}>
                    <div className={cl.item_title}>Линия</div>
                </div>
            </div>
            <div className={cl.toolbar_settings}>
                <label>
                    Толщина линии
                    <input
                        type="number"
                        onChange={event => dispatch(setLineWidth(event.target.value))}
                        defaultValue={1}
                        min={1}
                        max={50}
                    />
                </label>
                <label>
                    Толщина линии
                    <input type="number" defaultValue={1} min={1} max={50}/>
                </label>
            </div>
        </div>
    );
};

export default React.memo(Toolbar);
