// config toastr
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

var generateTimeStamp = function(){
    var time = new Date();
    return '?_=' + time.getTime();
}
var marketControllers = angular.module('marketControllers', []);
//GoodsListCtrl
marketControllers.controller('GoodsListsCtrl', ['$scope', '$http', "$filter", function($scope, $http, $filter) {
    //quantity patten
    $scope.pattern = /^[1-9]{1}\d*$/;
    $scope.filterGoods = function() {
        console.log($scope.goodsFilter);
        $scope.displayGoods = $filter('filter')($scope.allGoods, $scope.goodsFilter);
        $scope.pagination.init();
    }
    var updateGoods = function(currentPage) {
        pageSize = $scope.pagination.pageSize;
        $scope.goodsLists = $scope.displayGoods.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }
    $scope.updateQuantity = function(type, index) {
        var quantity = $scope.goodsLists[index].quantity
        $scope.goodsLists[index].quantity = (type === 'plus') ? parseInt(quantity) + 1 : (parseInt(quantity) - 1 <= 0 ? 1 : parseInt(quantity) - 1);
    }
    $scope.addToCart = function(e) {
            if (e.item.quantity) {
                $http({
                    method: 'POST',
                    url: '/market/recordAdd/',
                    data: { 'goodsId': e.item.id, 'quantity': e.item.quantity },
                    cache:false
                }).then(function(data) {
                    if (data.data.result) {
                        toastr.info('已添加至购物车');
                    } else {
                        toastr.info('添加失败，请重试');
                    }
                }, function errorCallback(response) {})
            }
        }
        //pagination object
    $scope.pagination = {
        'pageSize': 36,
        'tofont': true,
        'toend': false,
        'currentPage': 1,
        'totalPage': 0,
        'pages': [],
        'toborder': function() {
            this.tofont = this.currentPage === 1 ? true : false;
            this.toend = this.currentPage === this.totalPage ? true : false;
        },
        'pre': function() {
            this.currentPage = this.currentPage === 1 ? this.currentPage : this.currentPage - 1;
            updateGoods(this.currentPage);
            this.toborder();
        },
        'next': function() {
            this.currentPage = this.currentPage === this.totalPage ? this.totalPage : this.currentPage + 1;
            updateGoods(this.currentPage);
            this.toborder();
        },
        'to': function(page) {
            this.currentPage = page;
            updateGoods(page);
            this.toborder();
        },
        'init': function() {
            var totalPage = Math.ceil($scope.displayGoods.length / $scope.pagination.pageSize);
            this.totalPage = totalPage;
            this.pages = [];
            for (var i = 1; i <= totalPage; i++) {
                this.pages.push(i);
            }
            updateGoods(1);
            this.toborder();
        }
    };
    $http({
        method: 'GET',
        url: '/market/getAllGoods/'+generateTimeStamp(),
        cache:false
    }).then(function(response) {
        $scope.allGoods = response.data.data;
        for (i in $scope.allGoods) {
            $scope.allGoods[i].quantity = 1;
        }
        $scope.displayGoods = $scope.allGoods;
        $scope.pagination.init();
    }, function(response) {});
}]);

//orderlist controller

marketControllers.controller('OrderListsCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.orderList = [];
    $http.get('/market/policeOrderRetrieve/'+generateTimeStamp(),{'cache':false}).then(function(data) {
        $scope.orderList = data.data.data;
    }, function() {})
}]);


marketControllers.controller('OrderDetailCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $scope.orderId = parseInt($routeParams.id);
    $http.post('/market/policeOrderDetail/', { orderId: $scope.orderId },{'cache':false}).then(function(response) {
        $scope.totalAmount = 0;
        var total = 0;
        for (i in response.data.data) {
            $scope.totalAmount += response.data.data[i].amount;
        }
        $scope.orderDetail = response.data.data;
        $scope.totalQuantity = response.data.data.length;
    }, function() {})
    $scope.rePurchase = function() {
        $http.post('/market/policeSecondBuy/', { 'orderId': $scope.orderId },{'cache':false}).then(function(response) {
            if (response.data.result) {
                toastr.info('已成功添加至购物车');
            } else {
                toastr.warning('操作失败，请重试');
            }
        }, function() {})
    }
}]);

marketControllers.controller('CartCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.pattern = /^[1-9]{1}\d*$/;
    $scope.cartGoods = [];
    $scope.countTotalPrice = function() {
        var totalPrice = 0;
        for (i in $scope.cartGoods) {
            totalPrice += $scope.cartGoods[i].amount;
        }
        $scope.totalPrice = totalPrice.toFixed(1);
    };
    $scope.getCart = function() {
        $http.get('/market/cartRetrieve/'+generateTimeStamp(),{'cache':false}).then(function(data) {
            var cartGoods = data.data.data;
            $scope.cartGoods = cartGoods;
            $scope.countTotalPrice();
        }, function() {});
    };
    $scope.getCart();
    $scope.setQuantity = function(id, quantity) {
        console.log(quantity);
        if (quantity && !isNaN(quantity)) {
            $http.post('/market/recordModify/', { Id: id, quantity: quantity },{'cache':false}).then(function(data) {
                console.log(data);
                if (data.data.result) {
                    $scope.getCart();
                }
            }, function() {});
        } else {
            toastr.warning('请输入正确的数量');
        }
    }
    $scope.updateQuantity = function(type, index) {
        var quantity = $scope.cartGoods[index].quantity;
        console.log(quantity);
        quantity = (type === 'plus') ? parseInt(quantity) + 1 : (parseInt(quantity) - 1 <= 0 ? 1 : parseInt(quantity) - 1);
        var id = $scope.cartGoods[index].id;
        $scope.setQuantity(id, quantity);
    };
    $scope.deleteStuff = function(id, index) {
        console.log(id);
        $http.post('/market/cartCancel/', { cartId: id },{'cache':false}).then(function(data) {
            console.log(data);
            if (data.data.result) {
                $scope.getCart();
                toastr.info('删除成功');
            } else {
                toastr.warning('删除失败，请重试')
            }
        }, function() {});
    };
    $scope.deleteAllStuff = function() {
        $http.get('/market/cartCancelAll/'+generateTimeStamp(),{'cache':false}).then(function(data) {
            console.log(data);
            if (data.data.result) {
                $scope.getCart();
                toastr.info('删除成功');
            } else {
                toastr.warning('删除失败，请重试')
            }
        }, function() {});
    };

    $scope.submitCart = function() {
        if (confirm("请仔细核对购物清单，下单后将无法修改")) {
            $http.get('/market/cartSubmit/'+generateTimeStamp(),{'cache':false}).then(function(data) {
                if (data.data.result) {
                    $scope.getCart();
                    toastr.info('下单成功');
                } else {
                    toastr.warning('下单失败，请重试')
                }
            }, function() {});
        } else {
            return false;
        }
    };

}]);
