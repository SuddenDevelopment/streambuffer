import { Injectable } from '@angular/core';
import { List } from 'Immutable';
import { _ } from 'lodash';

@Injectable()
export class MockDataGeneratorService {
  private objConfig: Object = {
    size: number ,
    interval: number,
    newest: Object = {
      size: number
    },
    oldest: Boolean,
    debug: Boolean
  };

  private newest: Object = {
    data: Array,
    size: number
  }

  private oldest: Object = {
    data: Array,
    size: number
  }

  private i: number = 0;
  private arrCache: List<any> = List();
  private stats: Object = {
    total: number = 0,
    current: number = 0,
    last: number = 0,
    count: number = 0,
    avg: number = 0,
    tsUpdated: number = 0
  }
  private tsFirst: number = 0;
  private tsLast: number = 0;
  private travel: number = 0;
  private travelOld: number = 0;
  private fDebug: boolean

  constructor(private config: Object){
    if (!config) {
      this.objConfig={
  			 size:10000
  			,interval:500
  			,newest:{size:20}
  			,oldest:false
  			,debug:false
  		};
    }
    else{
      this.objConfig = _.merge(this.objConfig, config);
  		// if(typeof objConfig.fnEndRecords==='undefined'){ objConfig.fnEndRecords=function(){ this.config.stream===false; } }
  	}

    if(this.objConfig.newest) this.newest.size = this.objConfig.newest.size;
    if(this.objConfig.oldest) this.oldest.size = this.objConfig.oldest.size;
    this.fDebug = this.objConfig.debug;
  }

  public setConfig(): void {
    //TODO :: Implementation
  }

  public addData(arrData: Array, fnCallback: any): void {
    if (arrData.constructor !== Array) { arrData=[arrData]; }
    let intCount: number = arrData.length;
    this.stats.total = this.stats.total + intCount;
    this.stats.last = this.stats.current;
    this.stats.current = intCount;
    this.stats.count++;
    this.stats.avg = this.stats.total/this.stats.count;
    this.tsLast = Date.now();
    if(this.stats.total === this.stats.current){ this.tsFirst=Date.now(); }
    //reset the travel counter IF it makes sense, dont want it to jump around
    if(this.travel > this.newest.size+this.stats.current){ this.travel=0; }
    //add the data to the buffer
    this.arrCache=this.arrCache.concat(arrData);
    //console.log(this.stats.current,this.arrCache);
    if(this.arrCache.size>this.config.size){
      this.arrCache=this.arrCache.slice(this.arrCache.size-this.config.size,this.config.size);
      //this is for oldest travel
      this.travelOld=0;
    }
    this.fnSetViews();
    //send callback
    if(typeof fnCallback !== 'undefined'){
      fnCallback(this.newest.data,this.oldest.data);
    }
  }

  public fnSetViews(): void {
    if(this.config.newest){
      //set newest data, return as an array
      if(this.newest.size>this.arrCache.size){ this.newest.data=this.arrCache.toArray().reverse(); }
      else{
        this.newest.data=this.arrCache.slice(this.arrCache.size-this.newest.size-this.travel,this.arrCache.size-this.travel).toArray().reverse();
      }
    }
    if(this.config.oldest!==false){
      //set oldest data, return as an array
      if(this.oldest.size>this.arrCache.size){ this.oldest.data=this.arrCache.toArray(); }
      else{
        this.oldest.data=this.arrCache.slice(0+this.travelOld,this.oldest.size).toArray();
      }
    }
  }

  public move(intDistance: number,fnCallback: any): void {
    this.travel+=intDistance;
    this.fnSetViews();
    //send callback
    if(typeof fnCallback !== 'undefined'){
      fnCallback(this.newest.data,this.oldest.data);
    }
  }

}
