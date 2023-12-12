const app = angular.module('app', ['ngRoute'])

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeController'
        })
        .when('/about', {
            templateUrl: 'views/about.html'
        })
        .when('/menu', {
            templateUrl: 'views/menu.html',
            controller: 'menuController'
        })
        .when('/order', {
            templateUrl: 'views/order.html',
            controller: 'orderController'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);

app.controller('linkController', ['$scope', '$location', function($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation == $location.path();
    };
}]);

app.controller('homeController', ['$scope', '$http', function($scope, $http) {
    $http.get('../data/announcements.json')
        .then(function(res) {
            $scope.announcements = res.data;
        })
        .catch(function(error) {
            console.error('Error loading data:', error);
        });
}]);

app.controller('menuController', ['$scope', '$http', function($scope, $http){
    // $scope.categories = categories;
    // $scope.menu = menu;
    $http.get('../data/menu-items.json')
        .then(function(res) {
            // parse data
            $scope.menu = res.data;
            // get unique categories
            let categoriesSet = new Set(res.data.map(item => item.category));
            $scope.categories = [...categoriesSet];
        })
        .catch(function(error) {
            console.error('Error loading data:', error);
        });
}]);

app.controller('orderController', ['$scope', function($scope){
    $scope.toppings = ['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Extra Cheese', 'Peppers', 'Pineapple'];
    $scope.prices = {
        'Plain': 10,
        'Gluten Free': 12,
        'White': 11.50,
        'topping': 1
    }
    $scope.order = {
        username: '',
        email: '',
        phonenumber: '',
        pizzabase: '',
        // using dict here so that there can only be unique toppings
        toppings: {},
        notes: '',
        creditcard: '',
        expdate: '',
        cvv: ''
      };
    $scope.submitOrder = function(){
        if ($scope.orderForm.$valid) {
            alert('Order submitted!');
        }
    };
    $scope.totalCost = 0;
    $scope.updateTotalCost = function() {
        // each topping is $1
        // base pizza costs
        // plain - $10
        // gluten free - $12
        // white - $11.50
        let total = 0;
        if ($scope.order.pizzabase) {
            total += $scope.prices[$scope.order.pizzabase]
        }
        for (topping in $scope.order.toppings) {
            total += 1;
        }
        $scope.totalCost = 0;
        $scope.totalCost = total;
    };
    $scope.updateToppings = function(topping) {
        // if clicked topping is already in toppings ({}) then remove from toppings ({})
        // then update total cost

        for (let topping in $scope.order.toppings) {
            if ($scope.order.toppings.hasOwnProperty(topping) && !$scope.order.toppings[topping]) {
                delete $scope.order.toppings[topping];
            }
        }

        $scope.updateTotalCost();
    }
}]);