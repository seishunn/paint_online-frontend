import {createSlice} from "@reduxjs/toolkit";

interface IInitialState {
    tool: any
}
const initialState: IInitialState = {
    tool: ""
};

export const toolReducer = createSlice({
    name: "toolReducer",
    initialState,
    reducers: {
        setTool(state, action) {
            state.tool = action.payload;
        },
        setFillColor(state, action) {
            state.tool.fillColor = action.payload;
        },
        setStrokeColor(state, action) {
            state.tool.strokeColor = action.payload;
        },
        setLineWidth(state, action) {
            state.tool.lineWidth = action.payload;
        }
    }
})

export default toolReducer.reducer;