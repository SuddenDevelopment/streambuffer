import {Component, OnInit, OnDestroy} from '@angular/core';
import {HomeComponentConstant} from './home.constant';
// import { _ } from 'lodash';
import {MockDataGeneratorService} from '../shared/services/mock-data-generator.service';

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    abstract;
    public buttonConfig:Array<Object> = HomeComponentConstant.BUTTONS_CONFIG;

    private arrData:Array<any> = [];
    private arrStats:Array<any> = [];
    private arrNewest:Array<any> = [];
    private arrOldest:Array<any> = [];
    private intIndex:number = 0;
    private objRenderInterval:any;
    private objInterval:any;

    constructor(public mockDataGeneratorService:MockDataGeneratorService) {

    }

    ngOnInit() {
        this.mockDataGeneratorService.streambuffer({
            oldest: {size: 20}
            , newest: {size: 20}
            , debug: true
        });
        this.objRenderInterval = setInterval(() => {
            this.arrStats.push(this.mockDataGeneratorService.stats)
            let componentRef = this;
            this.mockDataGeneratorService.move(1, function (arrNew, arrOld) {
                componentRef.arrNewest = arrNew;
                componentRef.arrOldest = arrOld;
            })
        }, 500);
    }

    ngOnDestroy() {
        clearInterval(this.objInterval);
        clearInterval(this.objRenderInterval);
    }

    public performAction(dataObj:any):void {
        console.log(dataObj.action);
        switch (dataObj.action) {
            case "addOne":
            {
                this.addOne();
                break;
            }
            case "addBatch":
            {
                this.addBatch();
                break;
            }
            case "addBatches":
            {
                this.addBatches();
                break;
            }
            case "trickleIn":
            {
                this.trickleIn();
                break;
            }
            case "stop":
            {
                this.stop();
                break;
            }
            case "refresh":
            {
                this.refresh();
                break;
            }
            default:
            {
                console.log("Invalid choice");
                break;
            }
        }
    }

    private addOne():void {
        console.log("Add One Called");
        let componentRef = this;
        this.mockDataGeneratorService.addData([this.intIndex], function (arrNew, arrOld) {
            componentRef.arrNewest = arrNew;
            componentRef.arrOldest = arrOld;
        });
        this.intIndex++;
    }

    private addBatch():void {
        console.log("Add Batch Called");
        clearInterval(this.objInterval);
        //throw some data together
        let intRepeat:number = Math.random() * (1000 - 1) + 1;
        this.arrData = [];
        for (let i = 0; i < intRepeat; i++) {
            this.arrData[i] = this.intIndex;
            this.intIndex++;
        }
        //dump it in
        let componentRef = this;
        this.mockDataGeneratorService.addData(this.arrData, function (arrNew, arrOld) {
            componentRef.arrNewest = arrNew;
            componentRef.arrOldest = arrOld;
        });
    }

    private addBatches():void {
        console.log("Add Batches Called");
        clearInterval(this.objInterval);
        this.objInterval = setInterval(() => {
            let intRepeat:number = 500;
            for (let i = 0; i < intRepeat; i++) {
                this.intIndex++;
                this.arrData[i] = this.intIndex;
            }
            let componentRef = this;
            this.mockDataGeneratorService.addData(this.arrData, function (arrNew, arrOld) {
                componentRef.arrNewest = arrNew;
                componentRef.arrOldest = arrOld;
            });
        }, 500);
    }

    private trickleIn():void {
        console.log("trickleIn Called");
        clearInterval(this.objInterval);
        this.objInterval = setInterval(() => {
            this.arrData = [this.intIndex];
            let componentRef = this;
            this.mockDataGeneratorService.addData(this.arrData, function (arrNew, arrOld) {
                componentRef.arrNewest = arrNew;
                componentRef.arrOldest = arrOld;
            });
            this.intIndex++;
        }, 500);
    }

    private stop():void {
        console.log("stop Called");
        clearInterval(this.objInterval);
        clearInterval(this.objRenderInterval);
    }

    private refresh():void {
        console.log("refresh Called");
        this.arrStats.push(this.mockDataGeneratorService.stats);
    }
}
