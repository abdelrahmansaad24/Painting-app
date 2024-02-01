import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class svgService {

  constructor(private http: HttpClient) { }
  private url = 'http://localhost:8080/canvasData';

  getSvg(name: string){
    // return this.http.get(this.urlResult,{responseType: 'text'});
    return this.http.get(`${this.url}/${name}` ,{responseType: 'text'});
  }
  deleteSvg(name: string){
    return this.http.delete(`${this.url}/${name}`);
  }
  addSvg(svg: object){
    return this.http.post(this.url, svg);
  }
  getSvgNames(){
    return this.http.get(`${this.url}/names`)
  }
}
