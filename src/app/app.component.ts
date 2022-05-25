import { Component, OnInit } from '@angular/core';
import { LogFilterCriteria } from './models/log-filter-criteria.model';
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
  private _logFiler: LogFilterCriteria = {
    levelFilter: [],
    timeStampFilter: '',
    keywordFilter: []
  };

  public filterCriteriaList: LogFilter[] = [];
  public selectedLog?: PomelogKeyValuePair<LogLevel[]>;
  public logs: string[] = [];
  public fileLines: LogLine[] = [];
  private _fileLinesCopy: LogLine[] = [];
  public selectedLevels: PomelogKeyValuePair<boolean>[] = [];
  public selectedTime: number = 0;
  public copySource: string = '';
  public inCopy: boolean = false;

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

      if(!this.filterCriteriaList.includes(logFilter)){
        this.filterCriteriaList.push(logFilter);
        element.value = '';
        this.refreshFile();
      }
    }
  }

  // Remove a filter criteria
  public onFilterCriteriaRemove(index: number): void{
    if(index > -1){
      this.filterCriteriaList.splice(index, 1);
      this.refreshFile();
    }
  }

  // Read file when selected
  public onFileSelected(e: any): void{
    this.resetState();
    const uploadedFile: File = e.target.files[0];
    this.file = uploadedFile;
    this.loadFile(this.file);
  }

  public onFleCopy(): void{
    this.inCopy = !this.inCopy;
  }

  // Load file
  public loadFile(file: File): void{
    if(!file)
      return;
    
    const fileReader = new FileReader();
    fileReader.readAsText(file as Blob);
    let content: string = '';

    fileReader.onload = () => {
      content = fileReader.result?.toString() as string;
      this.fileLines = this._pomelogService.processFile(content, this.selectedLog as PomelogKeyValuePair<LogLevel[]>);
      this._fileLinesCopy = this.fileLines;
      this.refreshFile();
    }
  }

  public loadCopy(): void{
    this.fileLines = this._pomelogService.processFile(this.copySource as string, this.selectedLog as PomelogKeyValuePair<LogLevel[]>);
    this._fileLinesCopy = this.fileLines;
    this.resetState();
    this.refreshFile();
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

    let levelsTemp: string[] = [];

    this.selectedLevels.forEach(l => {
      if(l.value === true){
        levelsTemp.push(l.key as string);
      }
    });

    this._logFiler.levelFilter = levelsTemp;

    this.refreshFile();
  }

  // Determine if the level on click is current selected
  public isLevelSelected(level: string): boolean{
    if(!this.selectedLevels.find(x => x.key === level))
      return false;
    if(this.selectedLevels.find(x => x.key === level)?.value === false)
      return false;
    
    return true;
  }

  // Refresh the filters
  public refreshFile(): void{
    this.fileLines = this._fileLinesCopy;

    this.fileLines = this.filterByLevels(this.fileLines);
    this.fileLines = this.filterByTime(this.fileLines);
    this.fileLines = this.filterByKeywords(this.fileLines);
  }

  // Filter file by levels
  private filterByLevels(lines: LogLine[]): LogLine[]{
    if(this._logFiler.levelFilter?.length as number > 0){
      let filteredLines: LogLine[] = [];
      let levelFilters: string[] = this._logFiler.levelFilter as string[];

      lines.forEach(l => {
        if(levelFilters.includes(l.level?.level as string))
          filteredLines.push(l);
      });

      return filteredLines;
    }

    return lines;
  }

  // Filter file by time
  private filterByTime(lines: LogLine[]): LogLine[]{
    let filteredLines: LogLine[] = [];

    if(this.selectedTime == 0)
      return lines;
    
    lines.forEach(line => {
      let time: number = +(line.timeStamp?.split(':')[0] as string);
      let currentTime: number = new Date().getHours();

      if(time >= currentTime - this.selectedTime)
        filteredLines.push(line);
    });

    return filteredLines;
  }

  private filterByKeywords(lines: LogLine[]): LogLine[]{
    let filteredLines: LogLine[] = [];
    this._logFiler.keywordFilter = this.filterCriteriaList;
    if(this._logFiler.keywordFilter.length === 0)
      return lines;
    
    lines.forEach(ln => {
      this._logFiler.keywordFilter?.forEach(kw => {
        if(kw.criteria === 'Contains'){
          if(ln.line?.toLowerCase()?.includes(kw.filter?.toLowerCase() as string))
            filteredLines.push(ln);
        }else{
          if(!ln.line?.toLowerCase().includes(kw.filter?.toLocaleLowerCase() as string))
            filteredLines.push(ln);
        }
      });
    });

    return filteredLines;
  }

  // Reset log filter state
  private resetState(): void{
    this.selectedLevels = [];
    this.selectedTime = 0;
    this.filterCriteriaList = [];
    this.copySource = '';
    this.inCopy = false;
    this._logFiler = {
      levelFilter: [],
      timeStampFilter: '',
      keywordFilter: []
    };
  }
}
