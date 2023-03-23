import React from 'react';
import cl from "./SettingsPanel.module.scss";
import {useAppDispatch} from "../../utils/redux";
//Reducers
import {canvasReducer} from "../../reducers/canvas-reducer";
//Actions
const {undo, redo} = canvasReducer.actions;

const SettingsPanel = () => {
    const dispatch = useAppDispatch();

    return (
        <div className={cl.settingsPanel}>
            <button onClick={() => dispatch(undo())}>Отмена действия</button>
            <button onClick={() => dispatch(redo())}>Вернуть действие</button>
        </div>
    );
};

export default React.memo(SettingsPanel);
