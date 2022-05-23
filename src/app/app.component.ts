import { Component, OnInit } from '@angular/core';
import { LogFilter } from './models/log-filter.model';
import { LogLevel } from './models/log-level.model';
import { LogLine } from './models/log-line.model';
import { PomelogKeyValuePair } from './models/pomelog.keyvalue.pair.model';
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
  public selectedLog?: PomelogKeyValuePair<LogLevel[]>;
  public logs: string[] = [];
  public fileLines: LogLine[] = [];
  public selectedLevels: PomelogKeyValuePair<boolean>[] = [];

  constructor(private _pomelogService: PomelogService){
  }

  ngOnInit(): void {
    this.loadAvailableLogs();
    this.loadSelectedLogSchema('Serilog');
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
    const uploadedFile: File = e.target.files[0];
    this.file = uploadedFile;
    this.loadFile(this.file);
  }

  // Load file
  public loadFile(file: File): void{
    this.fileLines = this._pomelogService.readFile(file, this.selectedLog as PomelogKeyValuePair<LogLevel[]>);
  }

  // Load available logs
  public loadAvailableLogs(): void{
    this.logs = this._pomelogService.getAvailableLogs();
  }

  // Load selected log schema
  public loadSelectedLogSchema(log: string): void{
    this.selectedLog = this._pomelogService.getLogSchema(log);
    this.loadFile(this.file);
  }

  // On level tag selected
  public onLevelSelected(level: string): void{
    if(!this.selectedLevels.find(x => x.key === level)){
      this.selectedLevels.push({ key: level, value: true});
    }else{
      let index = this.selectedLevels.findIndex(x => x.key === level);

      if(index >= 0){
        if(this.selectedLevels[index].value !== null && this.selectedLevels[index].value !== undefined){
          this.selectedLevels[index].value = !this.selectedLevels[index].value;
        }
      }
    }
  }

  // Determine if the level on click is current selected
  public isLevelSelected(level: string): boolean{
    if(!this.selectedLevels.find(x => x.key === level))
      return false;
    if(this.selectedLevels.find(x => x.key === level)?.value === false)
      return false;
    
    return true;
  }
}
