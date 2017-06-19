"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var home_constant_1 = require("./home.constant");
var mock_data_generator_service_1 = require("../shared/services/mock-data-generator.service");
var HomeComponent = (function () {
    function HomeComponent(mockDataGeneratorService) {
        this.mockDataGeneratorService = mockDataGeneratorService;
        this.buttonConfig = home_constant_1.HomeComponentConstant.BUTTONS_CONFIG;
        this.arrData = [];
        this.arrStats = [];
        this.arrNewest = [];
        this.arrOldest = [];
        this.intIndex = 0;
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mockDataGeneratorService.streambuffer({
            oldest: { size: 20 },
            newest: { size: 20 },
            debug: true
        });
        this.objRenderInterval = setInterval(function () {
            _this.arrStats.push(_this.mockDataGeneratorService.stats);
            var componentRef = _this;
            _this.mockDataGeneratorService.move(1, function (arrNew, arrOld) {
                componentRef.arrNewest = arrNew;
                componentRef.arrOldest = arrOld;
            });
        }, 500);
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.objInterval);
        clearInterval(this.objRenderInterval);
    };
    HomeComponent.prototype.performAction = function (dataObj) {
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
    };
    HomeComponent.prototype.addOne = function () {
        console.log("Add One Called");
        var componentRef = this;
        this.mockDataGeneratorService.addData([this.intIndex], function (arrNew, arrOld) {
            componentRef.arrNewest = arrNew;
            componentRef.arrOldest = arrOld;
        });
        this.intIndex++;
    };
    HomeComponent.prototype.addBatch = function () {
        console.log("Add Batch Called");
        clearInterval(this.objInterval);
        var intRepeat = Math.random() * (1000 - 1) + 1;
        this.arrData = [];
        for (var i = 0; i < intRepeat; i++) {
            this.arrData[i] = this.intIndex;
            this.intIndex++;
        }
        var componentRef = this;
        this.mockDataGeneratorService.addData(this.arrData, function (arrNew, arrOld) {
            componentRef.arrNewest = arrNew;
            componentRef.arrOldest = arrOld;
        });
    };
    HomeComponent.prototype.addBatches = function () {
        var _this = this;
        console.log("Add Batches Called");
        clearInterval(this.objInterval);
        this.objInterval = setInterval(function () {
            var intRepeat = 500;
            for (var i = 0; i < intRepeat; i++) {
                _this.intIndex++;
                _this.arrData[i] = _this.intIndex;
            }
            var componentRef = _this;
            _this.mockDataGeneratorService.addData(_this.arrData, function (arrNew, arrOld) {
                componentRef.arrNewest = arrNew;
                componentRef.arrOldest = arrOld;
            });
        }, 500);
    };
    HomeComponent.prototype.trickleIn = function () {
        var _this = this;
        console.log("trickleIn Called");
        clearInterval(this.objInterval);
        this.objInterval = setInterval(function () {
            _this.arrData = [_this.intIndex];
            var componentRef = _this;
            _this.mockDataGeneratorService.addData(_this.arrData, function (arrNew, arrOld) {
                componentRef.arrNewest = arrNew;
                componentRef.arrOldest = arrOld;
            });
            _this.intIndex++;
        }, 500);
    };
    HomeComponent.prototype.stop = function () {
        console.log("stop Called");
        clearInterval(this.objInterval);
        clearInterval(this.objRenderInterval);
    };
    HomeComponent.prototype.refresh = function () {
        console.log("refresh Called");
        this.arrStats.push(this.mockDataGeneratorService.stats);
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home',
        styleUrls: ['./home.component.css'],
        templateUrl: './home.component.html'
    }),
    __metadata("design:paramtypes", [mock_data_generator_service_1.MockDataGeneratorService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
