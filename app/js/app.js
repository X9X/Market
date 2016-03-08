var marketApp = angular.module('marketApp', ['marketControllers', 'marketFilters', 'ngRoute', 'marketServices', 'marketAnimations']);

marketApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/goodsLists', {
            templateUrl: 'partials/goods_list.html',
            controller: 'GoodsCtrl'
        }).
        when('/orderLists', {
            templateUrl: 'partials/order_list.html',
            controller: 'OrderCtrl'
        }).
        when('/order/:phoneId', {
            templateUrl: 'partials/orderDetail.html',
            controller: 'OrderDetailCtrl'
        }).
        otherwise({
            redirectTo: '/goodsLists'
        });
    }
]);
