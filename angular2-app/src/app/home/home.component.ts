import {Component} from '@angular/core';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public buttonConfig: Object = {
    label: "Add One",
    action: "Add"
  };

  public performAction(dataObj: any): void {
    console.log(dataObj.action);
  }
}
