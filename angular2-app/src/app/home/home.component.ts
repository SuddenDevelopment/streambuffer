import {Component} from '@angular/core';
import {HomeComponentConstant} from './home.constant';

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    public buttonConfig: Array<Object> = HomeComponentConstant.BUTTONS_CONFIG;

    // var objBuffer = new streambuffer({
    //    oldest:{size:20}
    //   ,newest:{size:20}
    //   ,debug:true
    // });

    private arrData: Array<any> = [];
    private arrStats: Array<any> = [];
    private objInterval: Object = {};
    private intIndex: number = 0;

    public performAction(dataObj: any): void {
        console.log(dataObj.action);
        switch (dataObj.action) {
            case "addOne": {
                this.addOne();
                break;
            }
            case "addBatch": {
                this.addBatch();
                break;
            }
            case "addBatches": {
                this.addBatches();
                break;
            }
            case "trickleIn": {
                this.trickleIn();
                break;
            }
            case "stop": {
                this.stop();
                break;
            }
            case "refresh": {
                this.refresh();
                break;
            }
            default: {
                console.log("Invalid choice");
                break;
            }
        }
    }

    private addOne(): void {
        console.log("Add One Called");
    }

    private addBatch(): void {
        console.log("Add Batch Called");
    }

    private addBatches(): void {
        console.log("Add Batches Called");
    }

    private trickleIn(): void {
        console.log("trickleIn Called");
    }

    private stop(): void {
        console.log("stop Called");
    }

    private refresh(): void {
        console.log("refresh Called");
    }
}
