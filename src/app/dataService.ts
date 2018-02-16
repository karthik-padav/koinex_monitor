import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MyDataService {

  constructor(private http: Http) { }

  getTicker(){
    return this.http.get('https://koinex.in/api/ticker')
    .map(response => response.json())
  }

}
