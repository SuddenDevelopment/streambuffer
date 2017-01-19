var assert        = require("assert");
var should        = require("should");
var streambuffer   = require("../index.js");

describe('functions test', function () {
 this.timeout(6000);
 it('init and populate', function (done) {
    
    var objCache=new streambuffer();
    var arrView=objCache.newest.data;
    var arrData=[];
    for(i=0;i<200;i++){ arrData.push({someKey:i});}
    objCache.addData(arrData);

    //check
    console.log(objCache.newest.data);
   (objCache.stats.total).should.be.exactly(200);
   //done();
 });
});