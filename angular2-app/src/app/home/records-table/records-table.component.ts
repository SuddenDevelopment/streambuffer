import {Component, Input} from '@angular/core';

@Component({
  selector: 'sbfr-records-table',
  styleUrls: ['./records-table.component.css'],
  templateUrl: './records-table.component.html'
})
export class RecordsTableComponent {
  @Input()
  public arrOldest: Array<any> = [];

  @Input()
  public arrNewest: Array<any> = [];
}
