import Tool from "./Tool";

export default class Brush extends Tool{
    mouseDown: boolean = false;

    constructor(canvas: HTMLCanvasElement, socket: any, id: string) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler(e: any) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "stop",
                color: this.ctx.strokeStyle
            }
        }))
    }
    mouseDownHandler(e: any) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
    mouseMoveHandler(e: any) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "brush",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx.strokeStyle
                }
            }))
        }
    }

    static draw(ctx: any, x: number, y: number, color: string) {
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}