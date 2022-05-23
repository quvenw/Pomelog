import { LogLevel } from "../log-level.model";

export class LogConstant{
    public Trace: LogLevel = {
        level: 'Trace',
        color: '#04B01E'
    }

    public Debug: LogLevel = {
        level: 'Debug',
        color: '#04B0A1'
    }

    public Info: LogLevel = {
        level: 'Info',
        color: '#1198B6'
    }

    public Warn: LogLevel = {
        level: 'Warn',
        color: '#E5AF11'
    }

    public Error: LogLevel = {
        level: 'Error',
        color: '#DF2610'
    }

    public Fatal: LogLevel = {
        level: 'Fatal',
        color: '#6C0609'
    }

    public Verbose: LogLevel = {
        level: 'Verbose',
        color: '#04B01E'
    }

    public Information: LogLevel = {
        level: 'Information',
        color: '#1198B6'
    }

    public Warning: LogLevel = {
        level: 'Warning',
        color: '#E5AF11'
    }

    public All: LogLevel = {
        level: 'All',
        color: '#244DDA'
    }

    public Off: LogLevel = {
        level: 'Off',
        color: '#859FF8'
    }

    public Critical: LogLevel = {
        level: 'Critical',
        color: '#6C0609'
    }

    public Notice: LogLevel = {
        level: 'Notice',
        color: '#E8D21D'
    }

    public Alert: LogLevel = {
        level: 'Alert',
        color: '#B60A31'
    }

    public Emergency: LogLevel = {
        level: 'Emergency',
        color: '#440111'
    }
}