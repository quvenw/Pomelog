import { LogFilter } from "./log-filter.model";

export class LogFilterCriteria{
    public levelFilter?: string[];
    public timeStampFilter?: string;
    public keywordFilter?: LogFilter[];
}