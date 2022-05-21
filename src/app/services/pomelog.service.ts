import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PomelogService {

  constructor(private _http: HttpClient) { }

  public loadFile(path: string): any{
    this._http.get(path).subscribe(data => {
      console.log(data);
    });
  }
}
