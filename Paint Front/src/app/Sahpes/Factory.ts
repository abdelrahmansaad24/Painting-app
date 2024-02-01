import { Renderer2 } from "@angular/core";
import { Circle } from "./Circle";
import { Eclipse } from "./Eclipse";
import { Line } from "./Line";
import { Polygon } from "./Polygon";
import { Rectangle } from "./Rectangle";
import { Shape } from "./Shape";
import { Triangle } from "./Triangle";

export class Factory{
    constructor(private render:Renderer2, private SVG: any){}
    
    getShape(shapeType:string){		

        if(shapeType.trim().toLowerCase() == 'circle'){
            return new Circle(this.render, this.SVG);
        }else if(shapeType.trim().toLowerCase() == 'rectangle'){
            return new Rectangle(this.render, this.SVG);
        }else if(shapeType.trim().toLowerCase() == 'line'){
            return new Line(this.render, this.SVG);
        }else if(shapeType.trim().toLowerCase() == 'triangle'){
            return new Triangle(this.render, this.SVG);
        }else if(shapeType.trim().toLowerCase() == 'polygon'){
            return new Polygon(this.render, this.SVG);
        }else if(shapeType.trim().toLowerCase() == 'eclipse'){
            return new Eclipse(this.render, this.SVG);
        }else {
            return null;
        }

     }
}