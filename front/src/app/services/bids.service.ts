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
  
  postBid(body: any): Observable<any> {
    return this.http.post(this.origin + `/api/auction/bid`, body, {
      headers: this.headers
    });
  } 
  
  bidBotFire(item: string): Observable<any> {
    return this.http.post(this.origin + `/api/auction/bid/auto`, { item }, {
      headers: this.headers
    });
  } 
  
  botSettings(user: string, max: number): Observable<any> {
    return this.http.post(this.origin + `/api/auction/bid/bot`, {user, max}, {
      headers: this.headers
    });
  } 
  
  botEnable(user: string, item: string): Observable<any> {
    return this.http.post(this.origin + `/api/auction/bid/auto/switcher`, { item, user }, {
      headers: this.headers
    });
  } 
}
