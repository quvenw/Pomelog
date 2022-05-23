import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogConstant } from '../models/constant/log.constant.model';
import { LogConfig } from '../models/log-config.model';
import { LogLevel } from '../models/log-level.model';
import { LogLine } from '../models/log-line.model';
import { PomelogKeyValuePair } from '../models/pomelog.keyvalue.pair.model';

@Injectable({
  providedIn: 'root'
})
export class PomelogService extends LogConstant {
  private logs: string[] = ['NLog', 'Serilog', 'Log4j', 'Logback', 'Log4j2', 'SLF4j', 'Log4Net', '.Net Build In Log', 'Logging Django', 'Monolog'];



  private logCategoryA: LogLevel[] = [this.Trace, this.Debug, this.Info, this.Warn, this.Error, this.Fatal];
  private logCategoryB: LogLevel[] = [this.Verbose, this.Debug, this.Information, this.Warning, this.Error, this.Fatal];
  private logCategoryC: LogLevel[] = [this.All, this.Debug, this.Info, this.Warn, this.Error, this.Fatal, this.Off, this.Trace];
  private logCategoryD: LogLevel[] = [this.Debug, this.Info, this.Warning, this.Error, this.Critical];
  private logCategoryE: LogLevel[] = [this.Debug, this.Info, this.Notice, this.Warning, this.Error, this.Critical, this.Alert, this.Emergency];

  private logsPair: PomelogKeyValuePair<LogLevel[]>[] = [
    { key: 'NLog', value: this.logCategoryA },
    { key: 'Serilog', value: this.logCategoryB },
    { key: 'Log4j', value: this.logCategoryC },
    { key: 'Logback', value: this.logCategoryA },
    { key: 'Log4j2', value: this.logCategoryC },
    { key: 'SLF4j', value: this.logCategoryA },
    { key: 'Log4Net', value: this.logCategoryC },
    { key: '.Net Build In Log', value: this.logCategoryB },
    { key: 'Logging Django', value: this.logCategoryD },
    { key: 'Monolog', value: this.logCategoryE }
  ];

  constructor() { 
    super();
  }

  public readFile(file: File, logSchema: PomelogKeyValuePair<LogLevel[]>): LogLine[]{
    let fileLines: LogLine[] = []

    if(file){
      const fileReader = new FileReader();

      fileReader.readAsText(file);
      fileReader.onload = () => {
        let result = fileReader?.result?.toString().trim().replace(/\r\n/g,'\n').split('\n');

        result?.forEach(r => {
          let logLine: LogLine = {
            line: r,
            level: this.processFileLineLevel(r, logSchema.value as LogLevel[]),
            timeStamp: this.processFileTimestamp(r)
          };
          fileLines.push(logLine);
        });
      }

      return fileLines;
    }

    return [];
  }

  public getLogSchema(log: string): PomelogKeyValuePair<LogLevel[]>{
    let logSchema = this.logsPair.find(x => x.key === log) as PomelogKeyValuePair<LogLevel[]>;
    return logSchema;
  }

  public getAvailableLogs(): string[]{
    return this.logs;
  }

  private processFileLineLevel(line: string, levels: LogLevel[]): LogLevel{
    let findLevel: LogLevel = new LogLevel();

    levels?.forEach(level => {
      if(line.includes(level?.level as string))
        findLevel = level;
    });

    return findLevel;
  }

  private processFileTimestamp(line: string): string{
    let date = line.match("[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}");
    
    if(date){
      return date[0].toString();
    }

    return '';
  }
}
