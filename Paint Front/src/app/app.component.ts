import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { count, map } from 'rxjs';
import { __makeTemplateObject } from 'tslib';
import { Factory } from './Sahpes/Factory';
import { Shape } from './Sahpes/Shape';
import { svgService } from './svg-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit{

  @ViewChild('svg', {static: true}) svg: ElementRef = {} as ElementRef;
  constructor(private renderer: Renderer2, private service: svgService){}

  sahpes: Array<Shape> = [];
  undoStates:  { operation: string, shape: Shape }[] =  [];
  redoStates:  { operation: string, shape: Shape }[] =  [];
  selctedTool:any;
  isDrawing:boolean = false;
  selctedShape:any;
  ismouseDown = false;
  isMouseUp = true;
  fillColor:any = 'none';
  stroke = '#000000';
  stroke_width = '10';
  isMove = false;
  isFillClicked = false;
  Action:any;
  id:number = 0;
  countEdges:number = 0;
  indexofSelctedShape:any = null;

  ngAfterViewInit(): void {
    this.getSvgNames();
    document.getElementById('colorFill')?.addEventListener("input", this.changeColorForFill);
    document.getElementById('strokeColor')?.addEventListener("input", this.changeColorForStroke);
    document.getElementById('strokeSize')?.addEventListener("input", this.changeSizeOfStroke);
  }

  CapureDrawButton(type: string){
    const factory = new Factory(this.renderer, this.svg);
    this.selctedShape = factory.getShape(type);
    this.selctedTool = 'draw';
    this.isDrawing = true;
    document.querySelectorAll('._button').forEach((butt) =>{
      butt.classList.remove('active');
    });
    document.getElementById(type)?.classList.add('active');
    console.log(this.selctedShape);
  }

  fillClicked(){

    if (!this.isFillClicked){
      this.isFillClicked = true;

    }else{
      this.isFillClicked = false;
    }
  }

  changeColorForStroke = (event:any) =>{
    this.stroke = event.target.value;
  }

  changeColorForFill = (event:any) =>{
    document.getElementById('colorFill')?.setAttribute('value', event.target.value);
  }
  changeSizeOfStroke = (event:any) => {
    this.stroke_width = event.target.value;
  }

  move(){
    //retleive shapes from backend and store it in array                                ////////////////////////////////////////////////
    this.selctedTool = 'move';
    this.selctedShape = null;
    this.isDrawing = false;
    document.querySelectorAll('._button').forEach((butt) =>{
      butt.classList.remove('active');
    });
    document.getElementById('move')?.classList.add('active');
  }
  resize(){
    this.selctedTool = 'resize';
    this.selctedShape = null;
    this.isDrawing = false;
    document.querySelectorAll('._button').forEach((butt) =>{
      butt.classList.remove('active');
    });
    document.getElementById('resize')?.classList.add('active');
  }
  copy(){
    this.selctedTool = 'copy';
    this.selctedShape = null;
    this.isDrawing = false;
    document.querySelectorAll('._button').forEach((butt) =>{
      butt.classList.remove('active');
    });
    document.getElementById('copy')?.classList.add('active');
  }

  Delete(){
    this.selctedTool = 'delete';
    this.selctedShape = null;
    this.isDrawing = false;
    document.querySelectorAll('._button').forEach((butt) =>{
      butt.classList.remove('active');
    });
    document.getElementById('delete')?.classList.add('active');
  }


  undo(){
    console.log('undo');
    console.log(this.undoStates);

    let state = this.undoStates.pop(); // pop last change

    if (state?.operation == 'draw'){
      this.redoStates.push(state);
      state.shape.delete();
      for(let i = 0; i < this.sahpes.length; i++){
        if (this.sahpes[i].id == state.shape.id) {
          this.sahpes.splice(i, 1);
          break;
        }
      }
    }else if (state?.operation == 'delete'){
      this.redoStates.push(state);
      this.renderer.appendChild(this.svg.nativeElement, state.shape.getShape());
      this.sahpes.push(state.shape);

    }else if(state?.operation == 'copy'){

      this.redoStates.push(state);
      state.shape.delete();
      for(let i = 0; i < this.sahpes.length; i++){
        if (this.sahpes[i].id == state.shape.id) {
          this.sahpes.splice(i, 1);
          break;
        }
      }
    }else if(state?.operation == 'resize22'){
      console.log("state 1", state.shape.getShape());

      this.redoStates.push(state);
      state.shape.delete();
      for(let i = 0; i < this.sahpes.length; i++){
        if (this.sahpes[i].id == state.shape.id) {
          this.sahpes.splice(i, 1);
          break;
        }
      }
      let state2 = this.undoStates.pop()!;
      state2.shape.updateShape();
      console.log("state 2", state2.shape.getShape());

      this.redoStates.push(state2);
      this.renderer.appendChild(this.svg.nativeElement,  state2?.shape.getShape());
      this.sahpes.push(state2.shape);

    }else if(state?.operation == 'move22'){

      console.log('undo');

      this.redoStates.push(state);
      state.shape.delete();

      let state2 = this.undoStates.pop()!;

      state2.shape.updateShape();
      this.redoStates.push(state2);

      for(let i = 0; i < this.sahpes.length; i++){
        if (this.sahpes[i].id == state.shape.id) {
          this.sahpes.splice(i, 1);
          break;
        }
      }
      this.renderer.appendChild(this.svg.nativeElement,  state2?.shape.getShape());

      this.sahpes.push(state2.shape);
      console.log("x1 of old state", state.shape.x1);
      console.log("x1 of current state", state2.shape.x1);
    }
  }


  redo(){
    //console.log("redo");
    const state = this.redoStates.pop(); // pop last change // current state
    // console.log(state?.operation + " lol");
    if (state?.operation == 'draw'){

      this.undoStates.push(state);
      this.renderer.appendChild(this.svg.nativeElement,  state?.shape.getShape());
      this.sahpes.push(state.shape);

    }else if (state?.operation == 'delete'){

      this.undoStates.push(state);
      state.shape.delete();
      for(let i = 0; i < this.sahpes.length; i++){
        if (this.sahpes[i].id == state.shape.id) {
          this.sahpes.splice(i, 1);
          break;
        }
      }
    }else if(state?.operation == 'copy'){

      this.undoStates.push(state);
      this.renderer.appendChild(this.svg.nativeElement,  state?.shape.getShape());
      this.sahpes.push(state.shape);

    }else if(state?.operation == 'resize'){

      this.undoStates.push(state);
      state.shape.delete();       // delete current state

      const state2 = this.redoStates.pop()!; // old state

      state2.shape.updateShape();
      this.undoStates.push(state2);

      for(let i = 0; i < this.sahpes.length; i++){
        if (this.sahpes[i].id == state.shape.id) {
          this.sahpes.splice(i, 1);
          break;
        }
      }
      this.renderer.appendChild(this.svg.nativeElement,  state2?.shape.getShape());
      this.sahpes.push(state.shape);

    }else if(state?.operation == 'move'){

      this.undoStates.push(state);
      state.shape.delete();       // delete current state

      const state2 = this.redoStates.pop()!; // old state

      state2.shape.updateShape();
      this.undoStates.push(state2);

      for(let i = 0; i < this.sahpes.length; i++){
        if (this.sahpes[i].id == state.shape.id) {
          this.sahpes.splice(i, 1);
          break;
        }
      }
      this.renderer.appendChild(this.svg.nativeElement,  state2?.shape.getShape());
      this.sahpes.push(state.shape);
    }
  }

  withinThisShape(shape:Shape, x:any, y:any){
    if (shape.ContainPoint(x,y)){
      return true;
    }
    return false;
  }

  FindSelectedShape(event:MouseEvent){
    var x = event.offsetX;
    var y = event.offsetY;
    var isThisShape = false;
    for (var i = this.sahpes.length - 1; i >= 0 ; i--){
      isThisShape = this.withinThisShape(this.sahpes[i], x, y);
      if (isThisShape){
        this.indexofSelctedShape = i;
        return this.sahpes[i];
      }
    }
    return null;
  }
  mouseDown(event:MouseEvent){
    console.log("ksjsjj")
    this.ismouseDown = true;
    this.isMouseUp = false;
    if (this.selctedTool == 'move'){
      this.selctedShape = null;
      this.selctedShape = this.FindSelectedShape(event);
      if (this.selctedShape != null){
        this.Action = 'moving';
        this.undoStates.push({operation: 'move', shape: this.selctedShape.clone()});
        console.log(this.selctedShape.x1)
        this.selctedShape.updatePosition(event);
      }else{
        return;
      }

    }else if (this.selctedTool == 'copy'){

      this.selctedShape = null;
      this.selctedShape = this.FindSelectedShape(event);
      if (this.selctedShape != null){
        this.Action = 'copying';
        this.id += 1;

        var newShape = this.selctedShape.getCopy(this.id);
        ////////////////////////////////////////////////////////post to backend
        this.sahpes.push(newShape);
        this.undoStates.push({operation: 'copy', shape: newShape});
        //this.selctedTool = 'move';
      }else{
        return;
      }

    }else if (this.selctedTool == 'resize'){
      this.selctedShape = null;
      this.selctedShape = this.CursorTrackingonClick(event);
      if (this.selctedShape != null){
        this.Action = 'resizing';
        this.undoStates.push({operation: 'resize', shape: this.selctedShape.clone()});
      }else{
        return;
      }
    }else if (this.selctedTool == 'delete'){

      this.selctedShape = null;
      this.selctedShape = this.FindSelectedShape(event);
      if (this.selctedShape != null){
        this.Action = 'deleting';
        this.undoStates.push({operation: 'delete', shape: this.selctedShape.clone()});
        this.selctedShape.delete();
        //remove from array of shapes
        this.sahpes.splice(this.indexofSelctedShape, 1);
      }else{
        return;
      }

    }
    else if (this.selctedTool == 'draw'){
      this.Action = 'drawing';
      if (this.isFillClicked){
        this.fillColor = document.getElementById('colorFill')?.getAttribute('value');
      }else{
        this.fillColor = 'none';
      }
      this.id += 1;
      this.selctedShape.set(this.id, this.stroke, this.fillColor, this.stroke_width)
      this.selctedShape.startDraw(event);
      console.log('isdraw');
    }
  }

  mouseMove(event:MouseEvent){
    if (this.selctedTool == 'resize' && this.sahpes.length != 0){
      this.CursorTrackingonMove(event);
    }
    if (this.Action == 'drawing' && this.ismouseDown && this.selctedShape != null){
      this.selctedShape.draw(event);
    }else if (this.Action == 'moving'){
      this.selctedShape.update(event);
    }else if (this.Action == 'resizing'){
      this.selctedShape.resize(event);
    }

  }
  mouseUp(event:MouseEvent){
    if (this.Action == 'drawing' && this.selctedShape != null){
      //upload to backend                                           ///////////////////////////////////////
      this.sahpes.push(this.selctedShape.clone()); // when draw => just append shape after drawing finish
      this.undoStates.push({operation: 'draw', shape: this.selctedShape.clone()});
    }else if (this.Action == 'moving'){
      console.log('up')
      console.log(this.undoStates.push({operation: 'move22', shape: this.selctedShape.clone()}));
    }else if (this.Action == 'resizing'){
      this.undoStates.push({operation: 'resize22', shape: this.selctedShape.clone()});
    }
    this.ismouseDown = false;
    this.isMouseUp = true;
    this.Action = 'none';
    // console.log('print')
    // for (var i = 0; i < this.sahpes.length; i++){
    //   console.log(this.sahpes[i]);
    // }
  }

  mouseClick(event:MouseEvent){

  }


  CursorTrackingonMove(event:MouseEvent){
    for (var i = this.sahpes.length - 1; i >= 0; i--){
      if (this.sahpes[i]?.mouseOnEdges(event)){
         document.getElementById(this.sahpes[i].getId())?.classList.add('_cursor');
      }else {
         document.getElementById(this.sahpes[i].getId())?.classList.remove('_cursor');
      }
    }
  }
  CursorTrackingonClick(event:MouseEvent){
    for (var i = this.sahpes.length - 1; i >= 0; i--){
      if (this.sahpes[i]?.mouseOnEdges(event)){
        return this.sahpes[i];
      }
    }
    return null;
  }

  clear(){
    // Get a reference to the SVG element
    const svgElement = document.querySelector('svg')!;
    // Remove all child elements
    while (svgElement.firstChild) {
        svgElement.removeChild(svgElement.firstChild);
    }
    this.sahpes = [];
    this.selctedTool = null;
    this.isDrawing = false;
    this.selctedShape = null;
    this.ismouseDown = false;
    this.isMouseUp = true;
    this.fillColor = 'none';
    this.stroke = '#000000';
    this.stroke_width = '10';
    this.isMove = false;
    this.isFillClicked = false;
    this.Action= null;
    this.id = 0;
    this.countEdges = 0;
    this.indexofSelctedShape = null;
    this.undoStates =  [];
    this.redoStates =  [];
  }

  save(){
    const inputValue = (document.getElementById("fileName") as HTMLInputElement).value;
    const selectBox = document.getElementById("canvasFiles") as HTMLSelectElement;

    if(inputValue.length == 0) alert("you must provide a name");
    else {
      const svgElement = document.querySelector('svg')!;
      // Convert the SVG element to a data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      console.log('svg string before sent', svgData);
      const canvasUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

      var canvas = {
        "name": inputValue,
        "data": canvasUrl
      }
      this.service.addSvg(canvas).subscribe();
      //console.log(inputValue);
      var option = document.createElement("option");
      option.value = inputValue;
      option.text = inputValue;
      selectBox.add(option);
    }

  }
  ll(data: any){
    var cimg2 = new Image;
  }

  getClicked(){
    var selectBox = document.getElementById("canvasFiles") as HTMLSelectElement;
    if(selectBox.options.length>0){
      var strOption = selectBox.options[selectBox.selectedIndex].value;
      this.getCanvas(strOption);
    }else{
      alert("there are no previously saved files");
    }
  }

  getCanvas(name: string){
    this.clear();
    this.service.getSvg(name).subscribe(response =>{
      const encoded = response.replace('data:image/svg+xml;base64,', '');
      const parser = new DOMParser();
      const doc = parser.parseFromString(atob(encoded), "application/xml");
      this.applay(doc.documentElement);
    })
  }
  applay(element: HTMLElement){
    const shs = element.querySelectorAll("*");
    const factory = new Factory(this.renderer, this.svg);
    for (let i = 0; i < shs.length; i++){
      this.id += 1;
      if (shs[i].nodeName == 'circle'){
        const shape = factory.getShape('circle')!;
        shape?.setSaved(shs[i] as HTMLElement);
        this.sahpes.push(shape);
      }else if (shs[i].nodeName == 'eclipse'){
        const shape = factory.getShape('eclipse')!;
        shape?.setSaved(shs[i] as HTMLElement);
        this.sahpes.push(shape);
      }else if (shs[i].nodeName == 'line'){
        const shape = factory.getShape('line')!;
        shape?.setSaved(shs[i] as HTMLElement);
        this.sahpes.push(shape);
      }else if (shs[i].nodeName == 'rect'){
        const temp = shs[i] as HTMLElement;
        if (temp.getAttribute('width') == temp.getAttribute('height')){
          const shape = factory.getShape('polygon')!;
          shape?.setSaved(shs[i] as HTMLElement);
          this.sahpes.push(shape);
        }else{
          const shape = factory.getShape('rectangle')!;
          shape?.setSaved(shs[i] as HTMLElement);
          this.sahpes.push(shape);
        }

      }else if (shs[i].nodeName == 'polygon'){
        const shape = factory.getShape('triangle')!;
        shape?.setSaved(shs[i] as HTMLElement);
        this.sahpes.push(shape);
      }
      this.renderer.appendChild(this.svg.nativeElement, shs[i]);
    }
  }

  deleteClicked(){
    var selectBox = document.getElementById("canvasFiles") as HTMLSelectElement;
    if(selectBox.options.length>0){
      var strOption = selectBox.options[selectBox.selectedIndex].value;
      this.service.deleteSvg(strOption).subscribe();
      selectBox.remove(selectBox.selectedIndex);
    }
  }

  getSvgNames(){
    const selectBox = document.getElementById("canvasFiles") as HTMLSelectElement;
    var canvasNames: Array<string>;
    this.service.getSvgNames().subscribe(response => {
      canvasNames = response as Array<string>;
      for(let i = 0; i < canvasNames.length; i++){
        var option = document.createElement("option");
        option.value = canvasNames[i];
        option.text = canvasNames[i];
        selectBox.add(option);
      }
    });

  }
  erase(){


  }
  brush(){

  }

  freeHand(){

  }
}
