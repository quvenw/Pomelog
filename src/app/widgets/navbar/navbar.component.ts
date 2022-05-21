import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  @Output() themeModeHander: EventEmitter<any> = new EventEmitter();

  public title: string = 'Pomelog';
  public darkMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  // Notifying parent component on theme changed
  public onThemModeChange(darkMode: boolean): void{
    this.themeModeHander.emit(darkMode);
  }
}
