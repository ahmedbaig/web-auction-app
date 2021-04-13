import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getOrigin } from '../origin';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  origin = getOrigin();
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

  constructor(public http: HttpClient) {
  }

  getItem(id:string): Observable<any> {
    return this.http.get(this.origin + `/api/item/get/${id}`, {
      headers: this.headers
    });
  }

  getItems(): Observable<any> {
    return this.http.get(this.origin + `/api/item/get`, {
      headers: this.headers
    });
  }

  findItems(search: string): Observable<any> {
    return this.http.post(this.origin + `/api/item/search`, { keyword: search }, {
      headers: this.headers
    });
  }
  getItemsPaginate(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(this.origin + `/api/item/get?limit=${limit}&page=${page}`, {
      headers: this.headers
    });
  }
}
