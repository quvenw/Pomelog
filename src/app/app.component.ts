import { Component, OnInit } from '@angular/core';
import { LogFilter } from './models/log-filter.model';
import { PomelogService } from './services/pomelog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  public title: string = 'Pomelog';
  public darkMode: boolean = false;
  public file: any;

  public filterCriteriaList: LogFilter[] = [];

  constructor(private _pomelogService: PomelogService){
  }

  ngOnInit(): void {
    this.loadDefaultConfigJson();
  }

  // Assigning dark mode
  public onThemModeChange(darkMode: boolean): void{
    this.darkMode = darkMode;
  }

  // Add new filter criteria
  public onFilterCriteriaAdd(filter: string, criteria: string, element: HTMLInputElement): void{
    if(filter && criteria){
      let logFilter: LogFilter = {
        filter: filter,
        criteria: criteria
      };

      if(!this.filterCriteriaList.includes(logFilter))
        this.filterCriteriaList.push(logFilter);
        element.value = '';
    }
  }

  // Remove a filter criteria
  public onFilterCriteriaRemove(index: number): void{
    if(index > -1){
      this.filterCriteriaList.splice(index, 1);
    }
  }

  // Read file when selected
  public onFileSelected(e: any): void{
    const file: File = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(file);
    fileReader.onload = () => {
      let result = fileReader?.result?.toString().replace(/\r\n/g,'\n').split('\n');

      result?.forEach(r => {
        //console.log(r);
      });
    }
  }

  public loadDefaultConfigJson(): void{
    this._pomelogService.loadDefaultConfigFile();
  }
}
