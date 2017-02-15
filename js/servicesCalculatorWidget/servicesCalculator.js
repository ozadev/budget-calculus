
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
                            if(item.value) {
                                totalSpent += item.value * item.cost;
                            }
                        });

                        return totalSpent;
                    }

                }
            }
        }]
    );


})();