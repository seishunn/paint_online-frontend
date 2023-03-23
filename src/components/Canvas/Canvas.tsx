import React, {useEffect, useRef, useState} from 'react';
import cl from "./Canvas.module.scss";
import {useAppDispatch, useAppSelector} from "../../utils/redux";
import Brush from "../../tools/Brush";
import axios from "axios";
//Reducers
import {canvasReducer} from "../../reducers/canvas-reducer";
import {toolReducer} from "../../reducers/tool-reducer";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Rect from "../../tools/Rect";
import Eraser from "../../tools/Eraser";
import Line from "../../tools/Line";
import Circle from "../../tools/Circle";
//Actions
const {setCanvas, pushToUndo, setUsername, setSocket, setSessionId} = canvasReducer.actions;
const {setTool} = toolReducer.actions;

interface IMessage {
    id: string
    username: string
    method: string
    figure: {
        type: string
        x?: number
        y?: number
        r?: number
        width?: number
        height?: number
        endX?: number
        endY?: number
        color?: string
    }
}

const Canvas = () => {
    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const username = useAppSelector(state => state.canvasReducer.username);
    const [modalVisible, setModalVisible] = useState<boolean>(true);
    const params = useParams();

    useEffect(() => {
        dispatch(setCanvas(canvasRef.current));
        const ctx = canvasRef.current!.getContext("2d")!;
        axios.get(`http://localhost:8000/image?id=${params.id}`)
            .then(response => {
                const img: any = new Image()
                img.src = response.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height)
                    ctx.stroke()
                }
            })
    }, []);

    function drawHandler(msg: IMessage) {
        const figure = msg.figure
        const ctx = canvasRef.current!.getContext("2d")!;
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x!, figure.y!, figure.color!);
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x!, figure.y!, figure.width!, figure.height!, figure.color!);
                break
            case "eraser":
                Eraser.draw(ctx, figure.x!, figure.y!);
                break
            case "line":
                Line.staticDraw(ctx, figure.x!, figure.y!, figure.endX!, figure.endY!, figure.color!);
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x!, figure.y!, figure.r!, figure.color!);
                break
            case "stop":
                ctx.beginPath();
                break
        }
    }

    useEffect(() => {
        if (username) {
            const socket = new WebSocket("ws://localhost:8000/");
            dispatch(setSocket(socket));
            dispatch(setSessionId(params.id));
            dispatch(setTool(new Brush(canvasRef.current!, socket, params.id!)));
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                switch (msg.method) {
                    case "connection":
                        console.log(`пользователь ${msg.username} был подключен`);
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [username])

    const mouseDownHandler = () => {
        dispatch(pushToUndo(canvasRef.current?.toDataURL()));
        axios.post(`http://localhost:8000/image?id=${params.id}`, {img: canvasRef.current!.toDataURL()})
            .then(response => console.log(response.data))
    }

    function connectHandler() {
        dispatch(setUsername(inputRef.current!.value));
        setModalVisible(false);
    }

    return (
        <div className={cl.canvas}>
            <Modal show={modalVisible}>
                <Modal.Header>
                    <Modal.Title>Имя пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" className={cl.nameInp} ref={inputRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => connectHandler()}>
                        Вход
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas
                ref={canvasRef}
                width={620}
                height={620}
                onMouseDown={() => mouseDownHandler()}
            />
        </div>
    );
};

export default React.memo(Canvas);
