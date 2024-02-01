import { Renderer2 } from "@angular/core";
import { Factory } from "./Factory";
import { Shape } from "./Shape";

export class Line implements Shape{
    x1: any;
    y1: any;
    x2: any;
    y2: any;
    stroke: any;
    stroke_width: any;
    fill: any;
    type: any;
    id: any;
    shape: any;
    offset_x:any;
    ofsset_y:any;

    constructor(private render:Renderer2, private SVG:any){this.type = 'line'}


    draw(event: MouseEvent): void {
        this.x2 = event.offsetX;
        this.y2 = event.offsetY;
        this.shape.setAttribute('x2', this.x2);
        this.shape.setAttribute('y2', this.y2);
        this.render.appendChild(this.SVG.nativeElement, this.shape);

    }
    startDraw(event: MouseEvent): void {
        this.x1 = event.offsetX;
        this.y1 = event.offsetY;
        this.shape = this.render.createElement('line', 'svg');
        this.shape.setAttribute('x1', this.x1);
        this.shape.setAttribute('y1', this.y1);
        this.shape.setAttribute('stroke', this.stroke);
        this.shape.setAttribute('stroke-width', this.stroke_width);
        this.shape.setAttribute('id', this.id);
    }
    set(id:number, stroke: string, fill: string, stroke_width: string): void {
        this.stroke = stroke;
        this.fill = fill;
        this.stroke_width = stroke_width;
        this.id = 'l' + id.toString();
    }

    clone(): this {
        const clone = Object.create(this);
        clone.x1 = this.x1;
        clone.y1 = this.y1;
        clone.x2 = this.x2;
        clone.y2 = this.y2;
        clone.stroke = this.stroke;
        clone.stroke_width = this.stroke_width;
        clone.fill = this.fill;
        clone.shape = this.shape;
        clone.type = this.type;
        clone.id = this.id;
        return clone;
    }

    ContainPoint(x: any, y: any): boolean {
        return ((this.distance(this.x1, this.y1, x, y) + this.distance(this.x2, this.y2, x, y)) - this.distance(this.x1, this.y1, this.x2, this.y2) <= this.stroke_width / 4.5)
    }

    distance(x1:any, y1:any, x2:any, y2:any){
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }

    getType(){
        return this.type;
    }

    updatePosition(event:MouseEvent){
        this.offset_x = event.offsetX - this.x1;
        this.ofsset_y = event.offsetY - this.y1;
    }
    update(event:MouseEvent){
        var element = document.getElementById(this.id.toString());
        var width = this.x2 - this.x1;
        var height = this.y2 - this.y1;
        var m = event.offsetX - this.offset_x;
        var v = event.offsetY - this.ofsset_y;
        this.x1 = m;
        this.y1 = v;
        this.x2 = m + width;
        this.y2 = v + height;
        element?.setAttribute('x1', this.x1);
        element?.setAttribute('y1', this.y1);
        element?.setAttribute('x2', this.x2);
        element?.setAttribute('y2', this.y2);

    }
    getId():string{
        return this.id.toString();
    }
    getCopy(id:any):Shape{
        console.log(id);
        const clone = Object.create(this);
        clone.x1 = this.x1 + 20;
        clone.y1 = this.y1 + 20;
        clone.x2 = this.x2 + 20;
        clone.y2 = this.y2 + 20;
        clone.stroke = this.stroke;
        clone.stroke_width = this.stroke_width;
        clone.fill = this.fill;
        clone.type = this.type;
        clone.id = 'l' + id.toString();
        clone.shape = this.render.createElement('line', 'svg');
        clone.shape.setAttribute('x1', clone.x1);
        clone.shape.setAttribute('y1', clone.y1);
        clone.shape.setAttribute('x2', clone.x2);
        clone.shape.setAttribute('y2', clone.y2);
        clone.shape.setAttribute('stroke', clone.stroke);
        clone.shape.setAttribute('stroke-width', clone.stroke_width);
        clone.shape.setAttribute('id', clone.id);
        clone.render.appendChild(this.SVG.nativeElement, clone.shape);
        return clone;
    }
    delete():void{
        document.getElementById(this.id.toString())?.remove();
    }
    mouseOnEdges(event:MouseEvent):boolean{
        var isOnEdge = this.distance(this.x1, this.y1, event.offsetX, event.offsetY) < this.stroke_width / 2  || this.distance(this.x2, this.y2, event.offsetX, event.offsetY) < this.stroke_width / 2;
        return isOnEdge;
    }
    resize(event: MouseEvent): void {
        var element = document.getElementById(this.id.toString());
        if (this.distance(this.x1, this.y1, event.offsetX, event.offsetY) < this.stroke_width / 2){ // mouse of first edge
          this.x1 = this.x2;
          this.y1 = this.y2;
          element?.setAttribute('x1', this.x1);
          element?.setAttribute('y1', this.y1);
          this.x2 = event.offsetX;
          this.y2 = event.offsetY;
          element?.setAttribute('x2', this.x2);
          element?.setAttribute('y2', this.y2);
        }else{ // mouse on second edge
          this.x2 = event.offsetX;
          this.y2 = event.offsetY;
          element?.setAttribute('x2', this.x2);
          element?.setAttribute('y2', this.y2);
        }
    }
    setSaved(element: HTMLElement): void {
      this.x1 = parseFloat(element.getAttribute('x1')!);
      this.y1 = parseFloat(element.getAttribute('y1')!);
      this.stroke = element.getAttribute('stroke');
      this.stroke_width = parseFloat(element.getAttribute('stroke-width')!);
      this.id = element.getAttribute('id');
      this.x2 = parseFloat(element.getAttribute('x2')!);
      this.y2 = parseFloat(element.getAttribute('y2')!);
      this.shape = element;
    }
    getShape(): Shape {
      return this.shape;
    }
    updateShape(){
      this.shape.setAttribute('x1', this.x1);
      this.shape.setAttribute('y1', this.y1);
      this.shape.setAttribute('x2', this.x2);
      this.shape.setAttribute('y2', this.y2);
    }


}
