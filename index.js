//----====|| NOTES ||====----\\
// array.splice(start, deleteCount, item1, item2, ...) returns deleted items
//----===================----\\
var streambuffer = function(objConfig){ 'use strict'; var self=this;
//----====|| CONFIG ||====----\\
	if(typeof objConfig === 'undefined'){
		//set all defaults
		objConfig={
			,size:10000
			,speed:1
			,newest:{size:20}
			,oldest:false
		};
	}else{
		//check config and add defaults
	}
//----====|| PRIVATE ||====----\\
	//create the primary array for the cache, using a fixed length for speed/memory efficiency
	var arrCache = new Array(objConfig.size);
//----====|| PROPERTIES ||====----\\
	this.arrCache = arrCache;
	this.config = objConfig;
	this.stats = {};
	this.tsFirst = 0;
	this.tsLast = 0;
//----====|| METHODS ||====----\\
	this.setView = function(){};
	this.setConfig = function(){};
	this.addData = function(arrData){
		var intCount = arrData.length();
		var arrViews = Object.keys(self.views);
		//we MUST work with arrays, if it isn't stuff it into one.
		if(arrData.constructor !== Array){ arrData=[arrData]; }
		//if there is more than the limit, just trim and set it as the cache
		if(intCount >= self.config.size){ arrData.splice(self.config.size); arrCache=arrData; }
		//if it's one record, just do it
		else if(intCount === 1){ arrCache.pop(); arrCache.unshift(arrData[0]); }
		//otherwise need to move some chunks around
		else{
			//decide how many records will be kept after new ones are inserted.
			var intKeep = self.config.size-intCount;
			//create the new array from what's new and what's kept
			arrCache = arrData.concat(arrCache.splice(intKeep));
		}
		//need to set each of the views based on their defined positions
			//set the by position
		if(self.newest!==false){ 
			if(self.stats.total < self.newest.size){ self.newest.data=arrCache.slice(0,self.newest.size); }
			else{ self.newest.data=arrCache.slice(0,self.stats.total); }
		}
		if(self.config.oldest!==false){
			if(self.stats.total < self.oldest.size){ self.oldest.data=arrCache.slice(0,self.stats.total); }
			else if(self.stats.total < self.config.size){ self.oldest.data=arrCache.slice(self.stats.total-self.oldest.size,self.oldest.size); } }
			else{ self.oldest.data=arrCache.slice(self.config.size-self.views[arrViews[i]].size); }	 
		}
	};
	this.reset = function(){ arrCache = new Array(self.objConfig.size); };
	this.stop = function(){};
	this.go = function(){};
}
if (typeof module !== 'undefined' && module.exports){module.exports = streambuffer;}