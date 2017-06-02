//----====|| NOTES ||====----\\
// If there is new bursty data, buffer it, allow different views within it. keep caps and stuff in mind and high performance
// If there is no new data, trickle buffered data into view, direction of trickle based on on position of the view
// eval the above 2 things at a user defined interval
// for performance, a fixed size array is used for the cache and edited by positon as much as possible
// new records go at the end of the cache
// assume data coming in to be added is in the same order
// [1,2,3,4,5,6,7,8,9]  newest=9, oldest=1
//----===================----\\
var streambuffer = function(objConfig){ 'use strict'; var self=this;
//----====|| CONFIG ||====----\\
	if(typeof objConfig === 'undefined'){
		//set all defaults
		var objConfig={
			 size:10000
			,interval:500
			,newest:{size:20}
			,oldest:false
			,debug:false
		};
	}else{
		//check config and add defaults
		if(typeof objConfig.size==='undefined'){objConfig.size=10000;}
		if(typeof objConfig.interval==='undefined'){objConfig.interval=500;}
		if(typeof objConfig.newest==='undefined'){objConfig.newest=false;}
		if(typeof objConfig.oldest==='undefined'){objConfig.oldest=false;}
		if(typeof objConfig.debug==='undefined'){objConfig.debug=false;}
		if(typeof objConfig.fnEndRecords==='undefined'){ objConfig.fnEndRecords=function(){ self.config.stream===false; } }
	}
	if(objConfig.newest!==false){ 
		this.newest={}; 
		this.newest.data=[];
		this.newest.size=objConfig.newest.size;
	}
	if(objConfig.oldest!==false){ 
		this.oldest={}; 
		this.oldest.data=[];
		this.oldest.size=objConfig.oldest.size;
	}
//----====|| PRIVATE ||====----\\
	//create the primary array for the cache, using a fixed length for speed/memory efficiency
	var i=0;
//----====|| PROPERTIES ||====----\\
	this.arrCache = Immutable.List();
	this.config = objConfig;
	this.stats = {total:0,current:0,last:0,count:0,avg:0,tsUpdated:0};
	this.tsFirst = 0;
	this.tsLast = 0;
	this.travel=0;
	this.travelOld=0;
	this.fDebug=objConfig.debug;
//----====|| METHODS ||====----\\
	this.setConfig = function(){};
	this.addData = function(arrData,fnCallback){
		if(arrData.constructor !== Array){ arrData=[arrData]; }
		var intCount=arrData.length;
		self.stats.total = self.stats.total + intCount;
		self.stats.last = self.stats.current;
		self.stats.current = intCount;
		self.stats.count++;
		self.stats.avg=self.stats.total/self.stats.count;
		self.tsLast=Date.now();
		if(self.stats.total === self.stats.current){ self.tsFirst=Date.now(); }
		//reset the travel counter IF it makes sense, dont want it to jump around
		if(self.travel > self.newest.size+self.stats.current){ self.travel=0; }
		//add the data to the buffer
		self.arrCache=self.arrCache.concat(arrData);
		//console.log(self.stats.current,self.arrCache);
		if(this.arrCache.size>self.config.size){ 
			this.arrCache=this.arrCache.slice(self.arrCache.size-self.config.size,self.config.size); 
			//this is for oldest travel
			self.travelOld=0;
		}
		fnSetViews();
		//send callback
		if(typeof fnCallback !== 'undefined'){
			fnCallback(self.newest.data,self.oldest.data);
		}
		//are we streaming?
		if(self.stats.total === self.stats.current && self.config.stream===true){ 
			fnStreamRecords();
		}
	};
	var fnSetViews=function(){
		if(self.config.newest!==false){
			//set newest data, return as an array
			if(self.newest.size>self.arrCache.size){ self.newest.data=self.arrCache.toArray().reverse(); }
			else{ 
				self.newest.data=self.arrCache.slice(self.arrCache.size-self.newest.size-self.travel,self.arrCache.size-self.travel).toArray().reverse();
			}
		}
		if(self.config.oldest!==false){
			//set oldest data, return as an array
			if(self.oldest.size>self.arrCache.size){ self.oldest.data=self.arrCache.toArray(); }
			else{
				self.oldest.data=self.arrCache.slice(0+self.travelOld,self.oldest.size).toArray();
			}
		}
	};
	this.move=function(intDistance,fnCallback){
		self.travel+=intDistance;
		fnSetViews();
		//send callback
		if(typeof fnCallback !== 'undefined'){
			fnCallback(self.newest.data,self.oldest.data);
		}
	};
}
if (typeof module !== 'undefined' && module.exports){module.exports = streambuffer;}