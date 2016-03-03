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
            
            var a = inv.find(function(item) {return item.name == crop.name});
            
            if (a) {
                a.amount += 1;
            }
            else
            {
                inv.push({name: crop.name, description: crop.description, amount: 1});
            }
            
            
        }
    }
    
    $scope.plantCrop = function(crop) {
        var cropModel = $scope.crops.find(function(item) {return item.name == crop.name});
        
        if (!cropModel) return false;
        
        var field = $scope.field;
        var tilled = field.tilled;
        var planted = field.crops.length;
        
        if (planted < tilled) {
            var newCrop = {
                name: cropModel.name,
                growthStatus: cropModel.growthStatus,
                maxGrowth: cropModel.maxGrowth,
                growthRate: cropModel.growthRate,
                watered: false,
                water: function() {
                    if (!this.watered && $scope.player.canExecuteAction(5)){
                        this.watered = true;
                        $scope.player.subtractHealth(5);
                    }
                }
            };
            
            field.crops.push(newCrop);
            
            crop.amount -= 1;
            if (crop.amount < 1) {
                 $scope.player.inventory.splice(
                 $scope.player.inventory.findIndex(function(item) {return item.name == crop.name})
                 ,1);
            }
            
            return true;
        }
        
    }
    
    $scope.waterAllCrops = function() {
        $scope.field.crops.forEach(function(element) {
            element.water();
        }, this);
    };
    
    $scope.player = {
        name: 'Maddo',
        'currentHealth': 100,
        'maxHealth': 100,
        'money': 5000,
        inventory: [],
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