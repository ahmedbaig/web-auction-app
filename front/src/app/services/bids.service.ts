import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getOrigin } from '../origin';
@Injectable({
  providedIn: 'root'
})
export class BidsService {

  origin = getOrigin();
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

  constructor(public http: HttpClient) {
  }
  
  postBid(search: string): Observable<any> {
    return this.http.post(this.origin + `/api/item/search`, { keyword: search }, {
      headers: this.headers
    });
  } 
  
  bidBotFire(search: string): Observable<any> {
    return this.http.post(this.origin + `/api/item/search`, { keyword: search }, {
      headers: this.headers
    });
  } 
  
  botSettings(search: string): Observable<any> {
    return this.http.post(this.origin + `/api/item/search`, { keyword: search }, {
      headers: this.headers
    });
  } 
  
  botEnable(search: string): Observable<any> {
    return this.http.post(this.origin + `/api/item/search`, { keyword: search }, {
      headers: this.headers
    });
  } 
}
