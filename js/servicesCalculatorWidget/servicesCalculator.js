
(function () {
    'use strict';

    angular.module('servicesCalculator', []);

    angular.module('servicesCalculator').directive('servicesCalculator', [
        '$timeout',
        '$http',
        function ($timeout, $http) {
            return {
                templateUrl: './js/servicesCalculatorWidget/servicesCalculator.html',
                restrict: 'AE',
                replace: true,
                scope: {},
                    link: function (scope, element, attr) {

                    scope.list = [];
                    scope.budget = 0;
                    scope.value = 50;
                    scope.budgetSanitise = budgetSanitise;
                    scope.numberSanitise = numberSanitise;
                    scope.getProgressValue = getProgressValue;
                    scope.selectSanitise = selectSanitise;
                    scope.calcTotalSum = calcTotalSum;
                    scope.outBudget = false;
                    scope.topRange = 0;

                    $http({
                        method: 'GET',
                        url: './js/servicesCalculatorWidget/servicesCalculatorConfig.json'
                    }).then(function (response) {
                        scope.list = response.data;
                    }, function errorCallback(response) {
                        console.error('Error at servicesCalculatorConfig.json data load.')
                    });

                    //
                    //
                    //

                    function calcDiscount(value) {
                        var discount = 5;

                        if(value > 1500) discount = 10;
                        if(value > 2500) discount = 15;
                        if(value > 3500) discount = 20;
                        if(value > 5000) discount = 25;

                        return value * ((100 - discount) / 100);
                    }

                    function getProgressValue() {
                        var totalSpent = calcTotalSum();

                        if(totalSpent <= scope.budget) {
                            var result = parseInt(totalSpent / scope.budget * 100);
                            scope.topRange = 0;
                        }
                        else {
                            result = 100;
                            scope.topRange = parseInt((totalSpent - scope.budget) / totalSpent * 100);
                        }

                        if (isNaN(result)) {
                            result = 0;
                        }

                        return result
                    }

                    function flashOutBudgetLimit() {
                        scope.outBudget = true;
                        $timeout(function() {
                            scope.outBudget = false;
                        }, 500)
                    }

                    function numberSanitise(index) {

                        budgetSanitise();

                        if(isNaN(scope.list[index].value) || +scope.list[index].value < 0) {
                            scope.list[index].value = 0;
                        }

                        if(calcTotalSum() > scope.budget) {
                            flashOutBudgetLimit();
                        }

                        // while(calcTotalSum() > scope.budget) {
                        //     if(scope.list[index].value > 0) {
                        //         scope.list[index].value--;
                        //     }
                        //     else {
                        //         break;
                        //     }
                        // }

                    }

                    function selectSanitise(index) {
                        budgetSanitise();
                        // if(calcTotalSum() > scope.budget) {
                        //     scope.list[index].value = '0';
                        // }
                    }

                    function budgetSanitise() {
                        if(calcTotalSum() > scope.budget && scope.budget === 0) {
                            scope.list.forEach(function(item) {
                                item.value = 0;
                            });
                        }
                        // if(calcTotalSum() > scope.budget) {
                        //     scope.list.forEach(function(item) {
                        //         item.value = 0;
                        //     });
                        // }
                    }

                    function calcTotalSum() {
                        var totalSpent = 0;
                        scope.list.forEach(function(item) {
                            if(item.type === 'input') {
                                if(item.value) {
                                    totalSpent += item.value * item.cost;
                                }
                            }
                            else {
                                if(parseInt(item.value)) {
                                    totalSpent += parseInt(item.value);
                                }
                            }
                        });

                        return calcDiscount(totalSpent);
                    }

                    // scope.getOptionValue = getOptionValue;
                    //
                    // function getOptionValue(key) {
                    //     return parseInt(key); //(!isNaN(key)) ? parseInt(key) : key;
                    // }

                }
            }
        }]
    );


})();