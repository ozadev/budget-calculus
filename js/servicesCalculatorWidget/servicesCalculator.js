
(function () {
    'use strict';

    angular.module('servicesCalculator', []);

    angular.module('servicesCalculator').directive('servicesCalculator', [
        '$document',
        '$http',
        function ($document, $http) {
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

                    function getProgressValue() {
                        var totalSpent = calcTotalSum();

                        var result = parseInt(totalSpent / scope.budget * 100);

                        if (isNaN(result)) {
                            result = 0;
                        }

                        return result
                    }

                    function numberSanitise(index) {

                        if(isNaN(scope.list[index].value) || +scope.list[index].value < 0) {
                            scope.list[index].value = 0;
                        }

                        while(calcTotalSum() > scope.budget) {
                            if(scope.list[index].value > 0) {
                                scope.list[index].value--;
                            }
                            else {
                                break;
                            }
                        }

                    }

                    function selectSanitise(index) {
                        if(calcTotalSum() > scope.budget) {
                            scope.list[index].value = '0';
                        }
                    }

                    function budgetSanitise() {
                        if(calcTotalSum() > scope.budget) {
                            scope.list.forEach(function(item) {
                                item.value = 0;
                            });
                        }
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

                        return totalSpent;
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