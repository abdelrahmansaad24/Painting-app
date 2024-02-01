import { SelectControlValueAccessor } from "@angular/forms";

export interface Shape{
    x1:any;
    y1:any;
    x2:any;
    y2:any;
    stroke:any;
    stroke_width:any;
    fill :any;
    type:any;
    id:any;
    shape:any;

    draw(event:MouseEvent):void;
    startDraw(event:MouseEvent):void;
    set(id:number, stroke:string, fill:string, stroke_width:string):void;
    clone(): this;
    getType():string;
    getId():string;
    ContainPoint(x: any, y: any): boolean;
    mouseOnEdges(event:MouseEvent):boolean
    resize(event:MouseEvent):void;
    delete():void;
    setSaved(element : ChildNode): void;
    getShape(): Shape;
    updateShape(): void;
}
