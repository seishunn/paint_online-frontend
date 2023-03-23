import Brush from "./Brush";

export default class Eraser extends Brush {
    mouseDown: boolean = false;

    constructor(canvas: HTMLCanvasElement, socket: any, id: string) {
        super(canvas, socket, id);
    }
    mouseMoveHandler(e: any) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: "eraser",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop
                }
            }))
        }
    }

    static draw(ctx: any, x: number, y: number) {
        ctx.strokeStyle = "white";
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}