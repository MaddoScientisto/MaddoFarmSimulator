'use strict';

/* Controllers */

// var phonecatControllers = angular.module('phonecatControllers', []);
// 
// phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
//   function($scope, Phone) {
//     $scope.phones = Phone.query();
//     $scope.orderProp = 'age';
//   }]);
// 
// phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
//   function($scope, $routeParams, Phone) {
//     $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
//       $scope.mainImageUrl = phone.images[0];
//     });
// 
//     $scope.setImage = function(imageUrl) {
//       $scope.mainImageUrl = imageUrl;
//     };
//   }]);

var harvestMaddoApp = angular.module('harvestMaddoApp', ['harvestMaddoFilters']);

harvestMaddoApp.controller('HarvestMaddoCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('crops/crops.json').success(function (data) {
        $scope.crops = data;
    });


    $scope.buyCrop = function (crop) {

        if ($scope.player.money >= crop.basePrice) {
            $scope.player.money -= crop.basePrice;

            var inv = $scope.player.inventory;

            
            
            //var a = FindObjectInArray(inv, 'name', crop.name);
            
            var a = inv.find(function (item) { return item.name == crop.name });

            if (a) {
                a.amount += 1;
            }
            else {
                inv.push({ name: crop.name, description: crop.description, amount: 1 });
            }


        }
    }

    $scope.plantCrop = function (crop) {
        var cropModel = $scope.crops.find(function (item) { return item.name == crop.name });

        if (!cropModel) return false;

        var field = $scope.field;
        var tilled = field.tilled;
        var planted = field.crops.length;

        if (planted < tilled) {
            var newCrop = {
                name: cropModel.name,
                id: field.cropsIdCount,
                growthStatus: cropModel.growthStatus,
                maxGrowth: cropModel.maxGrowth,
                growthRate: cropModel.growthRate,
                sellPrice: cropModel.sellPrice,
                watered: false,
                mature: false,
                water: function () {
                    if (!this.watered && $scope.player.canExecuteAction(5)) {
                        this.watered = true;
                        $scope.player.subtractHealth(5);
                    }
                },
                sell: function () {
                    if (this.mature) {
                        //$scope.player.money += this.sellPrice;
                        var that = this;
                        $scope.player.shipped.push(this);
                        field.crops.splice(field.crops.findIndex(function (item) { return item.id == that.id }), 1);
                    }
                }
            };

            field.crops.push(newCrop);
            field.cropsIdCount++;

            crop.amount -= 1;
            if (crop.amount < 1) {
                $scope.player.inventory.splice(
                    $scope.player.inventory.findIndex(function (item) { return item.name == crop.name })
                    , 1);
            }

            return true;
        }

    }

    $scope.waterAllCrops = function () {
        $scope.field.crops.forEach(function (element) {
            element.water();
        }, this);
    };

    $scope.advanceDay = function () {
        
        // Grow Crops
        $scope.field.crops.forEach(function (element) {
            if (!element.mature && element.watered) {
                element.watered = false;
                element.growthStatus += element.growthRate;
                if (element.growthStatus >= element.maxGrowth) {
                    element.mature = true;
                    element.growthStatus = element.maxGrowth;
                }
            }

        }, this);

        // Eventually add debris to untilled slots
        // Eventually untill unplanted slots
        
        // Restore player health
        
        $scope.player.currentHealth = $scope.player.maxHealth;
        
        // Profits from shipped goods
        
        while ($scope.player.shipped.length > 0) {
            var t = $scope.player.shipped.pop();
            $scope.player.money += t.sellPrice;
        }                        
        
        
        // Advance the day
        
        $scope.environment.day += 1;

        if ($scope.environment.day > 30) {
            $scope.environment.day = 1;
            $scope.environment.season += 1;

            if ($scope.environment.season > 4) {
                $scope.environment.season = 1;
            }
        }

    };


    $scope.environment = {
        season: 1,
        day: 1,
        year: 1
    }

    $scope.player = {
        name: 'Maddo',
        'currentHealth': 50,
        'maxHealth': 50,
        'money': 100,
        inventory: [],
        shipped: [],
        canExecuteAction: function (amount) {
            if ($scope.player.currentHealth >= amount) {
                return true;
            }
            else return false;
        },
        subtractHealth: function (amount) {
            $scope.player.currentHealth -= amount;
        }
    };
    $scope.field = {
        'tiles': 100,
        'rocks': 50,
        'wood': 20,
        'weed': 20,
        'free': 10,
        'tilled': 0,
        cropsIdCount: 0,
        crops: [],
        till: function () {
            var actionCost = 5;
            if ($scope.field.free > 0 && $scope.player.canExecuteAction(actionCost)) {

                $scope.field.free -= 1;
                $scope.field.tilled += 1;
                $scope.player.subtractHealth(actionCost);
            }
        }
    }

}]);