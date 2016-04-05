var marketApp = angular.module('marketApp', ['marketControllers', 'marketFilters', 'ngRoute', 'marketServices', 'marketAnimations'], function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

marketApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/market/index', {
            templateUrl: '/static/views/market/app/partials/goods_list.html',
            controller: 'GoodsListsCtrl'
        }).
        when('/market/order', {
            templateUrl: '/static/views/market/app/partials/order_list.html',
            controller: 'OrderListsCtrl'
        }).
        when('/market/order/:id', {
            templateUrl: '/static/views/market/app/partials/order_detail.html',
            controller: 'OrderDetailCtrl'
        }).
        when('/market/cart', {
            templateUrl: '/static/views/market/app/partials/cart.html',
            controller: 'CartCtrl'
        }).
        otherwise({
            redirectTo: '/market/index'
        });
        $locationProvider.html5Mode(true);
    }
]);
