import Tool from "./Tool";

export default class Line extends Tool {
    mouseDown: boolean = false;
    saved: string = "";
    currentX: number = 0;
    currentY: number = 0;
    endX: number = 0;
    endY: number = 0;

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
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                x: this.currentX,
                y: this.currentY,
                endX: this.endX,
                endY: this.endY,
                color: this.ctx.fillStyle
            }
        }))
    }
    mouseDownHandler(e: any) {
        this.mouseDown = true;
        this.currentX = e.pageX - e.target.offsetLeft;
        this.currentY = e.pageY - e.target.offsetTop;
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentX, this.currentY)
        this.saved = this.canvas.toDataURL();
    }
    mouseMoveHandler(e: any) {
        if (this.mouseDown) {
            this.endX = e.pageX - e.target.offsetLeft;
            this.endY = e.pageY - e.target.offsetTop;
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }
    draw(x: number, y: number) {
        const img: any = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentX, this.currentY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx: any, currentX: number, currentY: number, endX: number, endY: number, color: string) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}