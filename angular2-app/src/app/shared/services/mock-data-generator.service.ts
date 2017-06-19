import { Injectable } from '@angular/core';
import { List } from 'immutable';

@Injectable()
export class MockDataGeneratorService {
    arrCache:any = List();
    config:any;
    newest:any;
    oldest:any;
    stats:any = {total: 0, current: 0, last: 0, count: 0, avg: 0, tsUpdated: 0};
    tsFirst:number = 0;
    tsLast:number = 0;
    travel:number = 0;
    travelOld:number = 0;
    fDebug:any;

    constructor() {
    }

    //----====|| NOTES ||====----\\
// If there is new bursty data, buffer it, allow different views within it. keep caps and stuff in mind and high performance
// If there is no new data, trickle buffered data into view, direction of trickle based on on position of the view
// eval the above 2 things at a user defined interval
// for performance, a fixed size array is used for the cache and edited by positon as much as possible
// new records go at the end of the cache
// assume data coming in to be added is in the same order
// [1,2,3,4,5,6,7,8,9]  newest=9, oldest=1
//----===================----\\
    streambuffer(objConfig) {
//----====|| CONFIG ||====----\\
        if (typeof objConfig === 'undefined') {
            //set all defaults
            var objConfig:any = {size: 10000, interval: 500, newest: {size: 20}, oldest: false, debug: false};
        } else {
            //check config and add defaults
            if (typeof objConfig.size === 'undefined') {
                objConfig.size = 10000;
            }
            if (typeof objConfig.interval === 'undefined') {
                objConfig.interval = 500;
            }
            if (typeof objConfig.newest === 'undefined') {
                objConfig.newest = false;
            }
            if (typeof objConfig.oldest === 'undefined') {
                objConfig.oldest = false;
            }
            if (typeof objConfig.debug === 'undefined') {
                objConfig.debug = false;
            }
            this.config = objConfig;

            if (typeof objConfig.fnEndRecords === 'undefined') {
                objConfig.fnEndRecords = function () {
                    this.config.stream === false;
                }
            }
        }
        if (objConfig.newest !== false) {
            this.newest = {};
            this.newest.data = [];
            this.newest.size = objConfig.newest.size;
        }
        if (objConfig.oldest !== false) {
            this.oldest = {};
            this.oldest.data = [];
            this.oldest.size = objConfig.oldest.size;
        }

//----====|| PROPERTIES ||====----\\
        this.config = objConfig;
        this.fDebug = objConfig.debug;
    }

    setConfig():void {

    }

    fnSetViews() {
        if (this.config.newest !== false) {
            //set newest data, return as an array
            if (this.newest.size > this.arrCache.size) {
                this.newest.data = this.arrCache.toArray().reverse();
            }
            else {
                this.newest.data = this.arrCache.slice(this.arrCache.size - this.newest.size - this.travel, this.arrCache.size - this.travel).toArray().reverse();
            }
        }
        if (this.config.oldest !== false) {
            //set oldest data, return as an array
            if (this.oldest.size > this.arrCache.size) {
                this.oldest.data = this.arrCache.toArray();
            }
            else {
                this.oldest.data = this.arrCache.slice(0 + this.travelOld, this.oldest.size).toArray();
            }
        }
    }

    move(intDistance, fnCallback) {
        this.travel += intDistance;
        this.fnSetViews();
        //send callback
        if (typeof fnCallback !== 'undefined') {
            fnCallback(this.newest.data, this.oldest.data);
        }
    }

    addData(arrData, fnCallback) {
        if (arrData.constructor !== Array) {
            arrData = [arrData];
        }
        var intCount = arrData.length;
        this.stats.total = this.stats.total + intCount;
        this.stats.last = this.stats.current;
        this.stats.current = intCount;
        this.stats.count++;
        this.stats.avg = this.stats.total / this.stats.count;
        this.tsLast = Date.now();
        if (this.stats.total === this.stats.current) {
            this.tsFirst = Date.now();
        }
        //reset the travel counter IF it makes sense, dont want it to jump around
        if (this.travel > this.newest.size + this.stats.current) {
            this.travel = 0;
        }
        //add the data to the buffer
        this.arrCache = this.arrCache.concat(arrData);
        //console.log(this.stats.current,this.arrCache);
        if (this.arrCache.size > this.config.size) {
            this.arrCache = this.arrCache.slice(this.arrCache.size - this.config.size, this.config.size);
            //this is for oldest travel
            this.travelOld = 0;
        }
        this.fnSetViews();
        //send callback
        if (typeof fnCallback !== 'undefined') {
            fnCallback(this.newest.data, this.oldest.data);
        }
    }
}
