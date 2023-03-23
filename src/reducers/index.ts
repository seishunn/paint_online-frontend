import {combineReducers, configureStore} from "@reduxjs/toolkit";
import toolReducer from "./tool-reducer";
import canvasReducer from "./canvas-reducer";

const rootReducer = combineReducers({
    toolReducer: toolReducer,
    canvasReducer: canvasReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];