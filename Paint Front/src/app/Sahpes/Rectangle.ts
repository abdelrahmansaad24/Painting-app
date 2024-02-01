import { Renderer2 } from "@angular/core";
import { Shape } from "./Shape";

export class Rectangle implements Shape{
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
    offset_y:any;
    private width:any
    private height:any;

    constructor(private render:Renderer2, private SVG:any){this.type = 'rectangle';}


    draw(event: MouseEvent): void {

        this.x2 = event.offsetX;
        this.y2 = event.offsetY;

        this.width =  Math.abs(this.x2 - this.x1);
        this.height = Math.abs(this.y2 - this.y1);

        this.shape.setAttribute('width', this.width);
        this.shape.setAttribute('height', this.height);
        this.render.appendChild(this.SVG.nativeElement, this.shape);
    }
    startDraw(event: MouseEvent): void {
        this.x1 = event.offsetX;
        this.y1 = event.offsetY;
        this.shape = this.render.createElement('rect', 'svg');
        this.shape.setAttribute('x', this.x1);
        this.shape.setAttribute('y', this.y1);
        this.shape.setAttribute('stroke', this.stroke);
        this.shape.setAttribute('fill', this.fill);
        this.shape.setAttribute('id', this.id.toString());
        this.shape.setAttribute('stroke-width', this.stroke_width);
    }

    set(id:number, stroke: string, fill: string, stroke_width: string): void {
        this.stroke = stroke;
        this.fill = fill;
        this.stroke_width = stroke_width;
        this.id = 'r' + id.toString();
    }
    public clone(): this {
        const clone = Object.create(this);
        clone.x1 = this.x1;
        clone.y1 = this.y1;
        clone.x2 = this.x2;
        clone.y2 = this.y2;
        clone.width = this.width;
        clone.height = this.height;
        clone.stroke = this.stroke;
        clone.stroke_width = this.stroke_width;
        clone.fill = this.fill;
        clone.shape = this.shape;
        clone.id = this.id;
        return clone;
    }
    ContainPoint(x: any, y: any): boolean {
        var minX = Math.min(this.x1, this.x2);
        var maxX = Math.max(this.x1, this.x2);
        var minY = Math.min(this.y1, this.y2);
        var maxY = Math.max(this.y1, this.y2);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    updatePosition(event:MouseEvent){
        this.offset_x = event.offsetX - this.x1;
        this.offset_y = event.offsetY - this.y1;
    }
    update(event:MouseEvent){
        var element = document.getElementById(this.id.toString());
        var width = this.x2 - this.x1;
        var height = this.y2 - this.y1;
        var m = event.offsetX - this.offset_x;
        var v = event.offsetY - this.offset_y;
        this.x1 = m;
        this.y1 = v;
        this.x2 = m + width;
        this.y2 = v + height;
        element?.setAttribute('x', this.x1);
        element?.setAttribute('y', this.y1);

    }
    getId():string{
        return this.id.toString();
    }
    getType(): string {
        return this.type;
    }

    getCopy(id:any):Shape{
        console.log(id);
        const clone = Object.create(this);
        clone.x1 = this.x1 + 20;
        clone.y1 = this.y1 + 20;
        clone.x2 = this.x2 + 20;
        clone.y2 = this.y2 + 20;
        clone.stroke = this.stroke;
        clone.width = this.width;
        clone.height = this.height;
        clone.stroke_width = this.stroke_width;
        clone.fill = this.fill;
        clone.type = this.type;
        clone.id = 'r' + id.toString();
        clone.shape = this.render.createElement('rect', 'svg');
        clone.shape.setAttribute('x', clone.x1);
        clone.shape.setAttribute('y', clone.y1);
        clone.shape.setAttribute('width', clone.width);
        clone.shape.setAttribute('height', clone.height);
        clone.shape.setAttribute('stroke', clone.stroke);
        clone.shape.setAttribute('stroke-width', clone.stroke_width);
        clone.shape.setAttribute('id', clone.id);
        clone.shape.setAttribute('fill', clone.fill);
        clone.render.appendChild(this.SVG.nativeElement, clone.shape);
        console.log(clone);
        return clone;
    }
    delete():void{
        document.getElementById(this.id.toString())?.remove();
    }
    mouseOnEdges(event:MouseEvent):boolean{
      var cuurX = event.offsetX;
      var currY = event.offsetY;
      if(Math.abs(cuurX - this.x2) <= this.stroke_width && Math.abs(currY - this.y2) <= this.stroke_width){
        return true;
      }
      return false;
    }
    resize(event: MouseEvent): void {
      var elem = document.getElementById(this.id.toString());
      this.x2 = event.offsetX;
      this.y2 = event.offsetY;
      this.width =  Math.abs(this.x2 - this.x1);
      this.height = Math.abs(this.y2 - this.y1);
      elem?.setAttribute('width', this.width);
      elem?.setAttribute('height', this.height);
    }

    setSaved(element: HTMLElement): void {
      this.x1 = parseFloat(element.getAttribute('x')!);
      this.y1 = parseFloat(element.getAttribute('y')!);
      this.stroke = element.getAttribute('stroke');
      this.fill = element.getAttribute('fill');
      this.id = element.getAttribute('id');
      this.stroke_width = parseFloat(element.getAttribute('stroke-width')!);
      this.width = parseFloat(element.getAttribute('width')!);
      this.height = parseFloat(element.getAttribute('height')!);
      this.x2 = this.width + this.x1;
      this.y2 = this.height + this.y1;
      this.shape = element;
    }
    getShape(): Shape {
      return this.shape;
    }
    updateShape(){
      this.shape.setAttribute('x', this.x1);
      this.shape.setAttribute('y', this.y1);
      this.shape.setAttribute('width', this.width);
      this.shape.setAttribute('height', this.height);
    }

}
