import {Component, Input} from '@angular/core';

@Component({
  selector: 'sbfr-log-status-pannel',
  styleUrls: ['./log-status-pannel.component.css'],
  templateUrl: './log-status-pannel.component.html'
})
export class LogStatusPannelComponent {

  @Input()
  public bufferLogsStats: Array<any> = [];

}
