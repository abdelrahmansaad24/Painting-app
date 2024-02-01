import { Renderer2, numberAttribute } from "@angular/core";
import { Shape } from "./Shape";

export class Triangle implements Shape{
    x1: any;
    y1: any;
    x2: any = null;
    y2: any = null;
    x3:any = null;
    y3:any = null;
    stroke: any;
    stroke_width: any;
    fill: any;
    type: any;
    id: any;
    shape: any;
    count:number = 0;
    offset_x:any;
    offset_y:any;

    constructor(private render:Renderer2, private SVG:any){this.type = 'triangle';}


    set(id:number, stroke: string, fill: string, stroke_width: string): void {
        this.stroke = stroke;
        this.fill = fill;
        this.stroke_width = stroke_width;
        this.id = 't' + id.toString();
    }


    startDraw(event: MouseEvent): void {
      this.x1 = event.offsetX;
      this.y1 = event.offsetY;
      this.shape = this.render.createElement('polygon', 'svg');
      this.shape.setAttribute('points', this.x1 + ' ' + this.y1);
      this.shape.setAttribute('stroke', this.stroke);
      this.shape.setAttribute('fill', this.fill);
      this.shape.setAttribute('stroke-width', this.stroke_width);
      this.shape.setAttribute('id', this.id.toString());
    }

    draw(event: MouseEvent): void {
      this.x2 = event.offsetX;
      this.y2 = event.offsetY;
      this.x3 = 2 * this.x1 - this.x2;
      this.y3 = this.y2;
      this.shape.setAttribute('points', this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.x3 + ' ' + this.y3);
      this.render.appendChild(this.SVG.nativeElement, this.shape);
    }

    clone(): this {
        const clone = Object.create(this);
        clone.x1 = this.x1;
        clone.y1 = this.y1;
        clone.x2 = this.x2;
        clone.y2 = this.y2;
        clone.x3 = this.x3;
        clone.y3 = this.y3;
        clone.stroke = this.stroke;
        clone.stroke_width = this.stroke_width;
        clone.fill = this.fill;
        clone.shape = this.shape;
        clone.type = this.type;
        clone.id = this.id;
        return clone;
    }

    getCopy(id:any):Shape{
      const clone = Object.create(this);
      clone.x1 = this.x1 + 20;
      clone.y1 = this.y1 + 20;
      clone.x2 = this.x2 + 20;
      clone.y2 = this.y2 + 20;
      clone.x3 = this.x3 + 20;
      clone.y3 = this.y3 + 20;
      clone.stroke = this.stroke;
      clone.stroke_width = this.stroke_width;
      clone.fill = this.fill;
      clone.type = this.type;
      clone.id = 't' + id.toString();
      clone.shape = this.render.createElement('polygon', 'svg');
      clone.shape.setAttribute('points', clone.x1 + ' ' + clone.y1 + ' ' + clone.x2 + ' ' + clone.y2 + ' ' + clone.x3 + ' ' + clone.y3);
      clone.shape.setAttribute('stroke', clone.stroke);
      clone.shape.setAttribute('fill', clone.fill);
      clone.shape.setAttribute('stroke-width', clone.stroke_width);
      clone.shape.setAttribute('id', clone.id);
      clone.render.appendChild(this.SVG.nativeElement, clone.shape);
      return clone;
    }

    ContainPoint(x: any, y: any): boolean {
      var vertex1 = [this.x1, this.y1];
      var vertex2 = [this.x2, this.y2];
      var vertex3 = [this.x3, this.y3];
      const detT = (vertex2[1] - vertex3[1]) * (vertex1[0] - vertex3[0]) + (vertex3[0] - vertex2[0]) * (vertex1[1] - vertex3[1]);
      const alpha = ((vertex2[1] - vertex3[1]) * (x - vertex3[0]) + (vertex3[0] - vertex2[0]) * (y - vertex3[1])) / detT;
      const beta = ((vertex3[1] - vertex1[1]) * (x - vertex3[0]) + (vertex1[0] - vertex3[0]) * (y- vertex3[1])) / detT;
      const gamma = 1 - alpha - beta;
      // Check if point is inside triangle
      return alpha >= 0 && beta >= 0 && gamma >= 0;
    }

    updatePosition(event:MouseEvent){
      this.offset_x = event.offsetX - this.x1;
      this.offset_y = event.offsetY - this.y1;
    }

    update(event:MouseEvent){
      var element = document.getElementById(this.id.toString());
      console.log(element);
      var m = event.offsetX - this.offset_x;
      var v = event.offsetY - this.offset_y;
      var temp1 = this.x1;
      var temp2 = this.y1;
      this.x1 = m;
      this.y1 = v;
      this.y2 = this.y1 + (this.y2 - temp2);
      this.y3 = this.y2;
      this.x2 = this.x1 + (this.x2 - temp1);
      this.x3 = this.x1 - (temp1 - this.x3);
      element?.setAttribute('points', this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.x3 + ' ' + this.y3);
    }

    getId():string{
        return this.id.toString();
    }
    getType(): string {
        return this.type.toString();
    }
    mouseOnEdges(event:MouseEvent):boolean{
      var cuurX = event.offsetX;
      var currY = event.offsetY;
      if(Math.abs(cuurX - this.x2) <= this.stroke_width && Math.abs(currY - this.y2) <= this.stroke_width || (Math.abs(cuurX - this.x3) <= this.stroke_width && Math.abs(currY - this.y3) <= this.stroke_width)){
        return true;
      }
      return false;
    }
    delete():void{
      document.getElementById(this.id.toString())?.remove();
    }
    resize(event:MouseEvent): void {
      var elem = document.getElementById(this.id.toString());
      this.x2 = event.offsetX;
      this.y2 = event.offsetY;
      this.x3 = 2 * this.x1 - this.x2;
      this.y3 = this.y2;
      elem?.setAttribute('points', this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.x3 + ' ' + this.y3);
    }

    setSaved(element: HTMLElement): void {
      const points = element.getAttribute('points')?.split(' ')!;
      this.x1 = parseFloat(points[0]);
      this.y1 = parseFloat(points[1]);
      this.x2 = parseFloat(points[2]);
      this.y2 = parseFloat(points[3])
      this.x3 = parseFloat(points[4]);
      this.y3 = parseFloat(points[5]);
      this.stroke = element.getAttribute('stroke');
      this.fill = element.getAttribute('fill');
      this.id = element.getAttribute('id');
      this.stroke_width = parseFloat(element.getAttribute('stroke-width')!);
      this.shape = element;
    }
    getShape(): Shape {
      return this.shape;
    }
    updateShape(){
      this.shape.setAttribute('points', this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.x3 + ' ' + this.y3);
    }
}
