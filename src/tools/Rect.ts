import Tool from "./Tool";
import {useAppSelector} from "../utils/redux";

export default class Rect extends Tool {
    mouseDown: boolean;
    startX: number;
    startY: number;
    saved: string = "";
    width: number = 0;
    height: number = 0

    constructor(canvas: HTMLCanvasElement, socket: any, id: string) {
        super(canvas, socket, id);
        this.listen();
        this.mouseDown = false;
        this.startX = 0;
        this.startY = 0;
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e: any) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle
            }
        }))
    }

    mouseDownHandler(e: any) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e: any) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x: number, y: number, w: number, h: number) {
        const img: any = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx: any, x: number, y: number, w: number, h: number, color: string) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
    }
}