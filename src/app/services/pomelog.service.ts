import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as defaultConfig from '../../assets/configs/default.json';

@Injectable({
  providedIn: 'root'
})
export class PomelogService {

  constructor(private _http: HttpClient) { }

  public loadDefaultConfigFile(): any{
    let config = JSON.parse(JSON.stringify(defaultConfig));
    console.log(config);
  }
}
