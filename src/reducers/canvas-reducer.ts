import {createSlice} from "@reduxjs/toolkit";

interface IInitialState {
    canvas: any
    undoList: any []
    redoList: any []
    username: string
    socket: any
    sessionId: any
}
const initialState: IInitialState = {
    canvas: "",
    undoList: [],
    redoList: [],
    username: "",
    socket: null,
    sessionId: null
};

export const canvasReducer = createSlice({
    name: "canvasReducer",
    initialState,
    reducers: {
        setCanvas(state, action) {
            state.canvas = action.payload;
        },
        setUsername(state, action) {
            state.username = action.payload;
        },
        setSocket(state, action) {
            state.socket = action.payload;
        },
        setSessionId(state, action) {
            state.sessionId = action.payload;
        },
        pushToUndo(state, action) {
            state.undoList = [...state.undoList, action.payload];
        },
        pushToRedo(state, action) {
            state.redoList.push(action.payload);
        },
        undo(state) {
            let ctx = state.canvas.getContext("2d");
            const canvasWidth = state.canvas.width;
            const canvasHeight = state.canvas.height;

            if (state.undoList.length > 0) {
                let img = new Image();
                let dataUrl = state.undoList.pop()
                img.src = dataUrl;
                state.redoList.push(state.canvas.toDataURL());
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                }
            } else {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            }
        },
        redo(state) {
            let ctx = state.canvas.getContext("2d");
            const canvasWidth = state.canvas.width;
            const canvasHeight = state.canvas.height;

            if (state.redoList.length > 0) {
                let img = new Image();
                let dataUrl = state.redoList.pop()
                img.src = dataUrl;
                state.undoList.push(state.canvas.toDataURL());
                img.onload = async () => {
                    await ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                    await ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                }
            }
        }
    }
})

export default canvasReducer.reducer;