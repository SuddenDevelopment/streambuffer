import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'sbfr-button',
  styleUrls: ['./button.component.css'],
  templateUrl: './button.component.html'
})
export class ButtonComponent{

  @Input()
  public buttonConfig: Object = {};

  @Output() onButtonClick = new EventEmitter();

  public onClick(): void {
    this.onButtonClick.emit(this.buttonConfig);
  }
}
