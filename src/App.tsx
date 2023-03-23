import React from 'react';
import "./styles/App.scss";
import Toolbar from "./components/Toolbar/Toolbar";
import SettingsPanel from "./components/SettingsPanel/SettingsPanel";
import Canvas from "./components/Canvas/Canvas";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path={"/:id"} element={
                        <>
                            <Toolbar/>
                            <div className="main">
                                <SettingsPanel/>
                                <div className="canvas_block">
                                    <Canvas/>
                                </div>
                            </div>
                        </>
                    }/>
                    <Route path={"*"} element={<Navigate to={`f${(+new Date).toString(16)}`}/>}/>
                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;
