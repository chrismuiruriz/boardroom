var boardroomApp = angular.module('boardroom', ['ngRoute', 'ngSanitize']);

// configure page routes
boardroomApp.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: 'src/views/home.html',
        controller: 'homeController',
        resolve: {
            "check": function ($location) {
                if (1 == 1) {
                    //Do something
                } else {
                    $location.path('/login/');    //redirect user to home.
                    alert("You don't have access here");
                }
            }
        }
    }).when('/cart/', {
        templateUrl: 'src/views/cart.html',
        controller: 'cartController',
        resolve: {
            "check": function ($location) {
                if (1 == 1) {
                    //Do something
                } else {
                    $location.path('/');    //redirect user to home.
                    alert("You don't have access here");
                }
            }
        }
    }).when('/orders/', {
        templateUrl: 'src/views/orders.html',
        controller: 'ordersController',
        resolve: {
            "check": function ($location) {
                if (1 == 1) {
                    //Do something
                } else {
                    $location.path('/');    //redirect user to home.
                    alert("You don't have access here");
                }
            }
        }
    }).when('/login/', {
        templateUrl: 'src/views/login.html',
        controller: 'loginController'
    }).when('/register/', {
        templateUrl: 'src/views/register.html',
        controller: 'registerController'
    }).when('/password/', {
        templateUrl: 'src/views/password.html',
        controller: 'passwordController'
    });

    $locationProvider.html5Mode(false);
});

// home controller
boardroomApp.controller('homeController', function ($scope, $http) {
    if (localStorage.userId) {
        $scope.userTitleBar = localStorage.userName;
    } else {
        location.href = "#/login/";
    }
    $scope.hasDrinks = false;
    $scope.addToCart = function (e, productId, productName) {
        var el = event.currentTarget;
        swal('Sending to cart...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: "http://mesmerizestudiokenya.com/boardroom/api/ios-addToCart.php",
            headers: {
                'Content-Type': undefined
            },
            data: {"userId": localStorage.userId, "productId": productId, "productQuantity": 1, "source": "OWNER"}
        };
        $http(config).success(function (response) {
            console.log(response);
            if (response.addToCartstatus == "SUCCESS") {
                swal({
                    text: '1 ' + productName + ' added to your cart.',
                    timer: 1500
                }).then(
                        function () {},
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                console.log('I was closed by the timer');
                            }
                        }
                );
            } else {
                swal({
                    text: 'Unknown Error! Try again.',
                    timer: 1500
                }).then(
                        function () {},
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                console.log('I was closed by the timer');
                            }
                        }
                );
            }
        }).error(function () {
            swal({
                text: 'Internet Connection Error! Try again.',
                timer: 1500
            }).then(
                    function () {},
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer');
                        }
                    }
            );
        });
    };

    $scope.getDrinksRequest = function () {
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-getDrinks.php";
        swal('Loading Drinks...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"userEmail": localStorage.userId}
        };
        $scope.drinks = []
        $http(config).success(function (response) {
            console.log(response);
            swal.close();
            if (response != null) {
                $scope.drinks = response;
                if (response.length >= 1) {
                    $scope.hasDrinks = true;
                }
            } else {
                swal({
                    title: 'Unknown Error!',
                    text: "Cannot Display Drinks.",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                });
            }
        }).error(function () {
            swal({
                title: 'Internet Connection Error!',
                text: "Cannot Display Drinks.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(function () {
                console.log("OK");
            });
        });
    };

    $scope.getDrinksRequest();
});

// cart controller
boardroomApp.controller('cartController', function ($scope, $http) {
    if (localStorage.userId) {
        $scope.userTitleBar = localStorage.userName;
    } else {
        location.href = "#/login/";
    }
    $scope.hasCart = false;
    $scope.cartItems = [];
    $scope.totalAmountInCart = "";
    $scope.showTotal = false;

    $scope.getTotalInCart = function () {
        var total = 0;
        for (var i = 0; i < $scope.cartItems.length; i++) {
            var product = $scope.cartItems[i];
            total += (product.productPrice * product.productQuantity);
        }
        $scope.totalAmountInCart = total;
        console.log("Total Amount: " + total);
    };

    $scope.getCartRequest = function () {
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-getCart.php";
        swal('Loading your cart...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"userId": localStorage.userId}
        };
        $http(config).success(function (response) {
            console.log(response);
            swal.close();
            if (response !== null) {
                if (response.length >= 1) {
                    $scope.hasCart = true;
                    console.log("Empty!");
                }
                $scope.cartItems = response;
                $scope.showTotal = true;
                $scope.getTotalInCart();
            } else {
                swal({
                    title: 'Unknown Error!',
                    text: "Cannot display your cart.",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                });
            }
        }).error(function () {
            swal({
                title: 'Internet Connection Error!',
                text: "Cannot display your cart.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(function () {
                console.log("OK");
            });
        });
    };

    //user
    $scope.getCartRequest();

    //update cart request
    $scope.editItemRequest = function (event) {
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-updateCart.php";
        swal('Updating...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"userId": localStorage.userId, "cartId": $scope.itemCartId, "productQuantity": $scope.itemEditQuantity}
        };
        $http(config).success(function (response) {
            swal.close();
            if (response.status === "SUCCESS") {
                $scope.getCartRequest();
                $('#editCartModal').rmodal('hide');
            } else {
                swal({
                    text: "Unknown Error! Try Again",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                });
            }
        }).error(function () {
            swal({
                text: "Server Error! Try Again",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(function () {
                console.log("OK");
            });
        });
    };

    //delete cart item
    $scope.deleteItemRequest = function (event) {
        swal({
            title: "Remove Item from Cart!",
            text: "Are you sure you want to remove this item from your cart?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "Nope!",
            closeOnConfirm: false,
            closeOnCancel: true
        }).then(function (isConfirm) {
            if (isConfirm) {
                var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-deleteCartItem.php";
                swal('Deleting...');
                swal.showLoading();
                var config = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': undefined
                    },
                    data: {"userId": localStorage.userId, "cartId": $scope.itemCartId}
                };
                $http(config).success(function (response) {
                    swal.close();
                    if (response.status === "SUCCESS") {
                        $scope.getCartRequest();
                        $('#editCartModal').rmodal('hide');
                    } else {
                        swal({
                            text: "Unknown Error! Try Again",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                        }).then(function () {
                            console.log("OK");
                        });
                    }
                }).error(function () {
                    swal({
                        text: "Server Error! Try Again",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    }).then(function () {
                        console.log("OK");
                    });
                });
            }
        }, function (isConfirm) {
            console.log(isConfirm);
        });
    };

    //empty cart
    $scope.emptyCartRequest = function (event) {
        swal({
            title: "Empty your Cart!",
            text: "Are you sure you want to empty this cart?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, empty it!",
            cancelButtonText: "Nope!",
            closeOnConfirm: false,
            closeOnCancel: true
        }).then(function (isConfirm) {
            if (isConfirm) {
                var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-emptyCart.php";
                swal('Clearing Your cart...');
                swal.showLoading();
                var config = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': undefined
                    },
                    data: {"userId": localStorage.userId, "tempId": $(".temp-cart-id").val()}
                };
                $http(config).success(function (response) {
                    swal.close();
                    if (response.status === "SUCCESS") {
                        $scope.getCartRequest();
                        $scope.hasCart = false;
                    } else {
                        swal({
                            text: "Unknown Error1! Try Again",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                        }).then(function () {
                            console.log("OK");
                        });
                    }
                }).error(function () {
                    swal({
                        text: "Server Error! Try Again",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    }).then(function () {
                        console.log("OK");
                    });
                });
            }
        }, function (isConfirm) {
            console.log(isConfirm);
        });
    };

    //confirm cart
    $scope.confirmCartRequest = function (event) {
        swal({
            title: "Submit your order?",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, submit it!",
            cancelButtonText: "Nope!",
            closeOnConfirm: false,
            closeOnCancel: true
        }).then(function (isConfirm) {
            if (isConfirm) {
                var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-submitOrder.php";
                swal('Sending...');
                swal.showLoading();
                var config = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': undefined
                    },
                    data: {"userId": localStorage.userId, "tempId": $(".temp-cart-id").val()}
                };
                $http(config).success(function (response) {
                    swal.close();
                    if (response.status === "SUCCESS") {
                        $scope.getCartRequest();
                    } else {
                        swal({
                            text: "Unknown Error1! Try Again",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'OK'
                        }).then(function () {
                            console.log("OK");
                        });
                    }
                }).error(function () {
                    swal({
                        text: "Server Error! Try Again",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    }).then(function () {
                        console.log("OK");
                    });
                });
            }
        }, function (isConfirm) {
            console.log(isConfirm);
        });
    };

    //edit cart model
    $scope.editCart = function (event, cartId, productName, productQuantity, productPrice, productTotal) {
        $scope.itemCartId = cartId;
        $scope.itemEditName = productName;
        $scope.itemEditPrice = productPrice;
        $scope.itemEditQuantity = productQuantity;
        $scope.itemEditTotal = productTotal;
        //show modal
        $('#editCartModal').rmodal('show');
    };

    $scope.closeCartModel = function () {
        $('#editCartModal').rmodal('hide');
    };
});

// order controller
boardroomApp.controller('ordersController', function ($scope, $http) {
    $scope.orderTitle = "TODAY'S ORDERS";
    if (localStorage.userId) {
        $scope.userTitleBar = localStorage.userName;
    } else {
        location.href = "#/login/";
    }

    $scope.hasOrders = false;
    //pick a date
    var picker = new Pikaday({
        field: $('#date-from')[0],
        format: 'DD/MM/YYYY',
        firstDay: 1
    });

    //pick a date
    var picker = new Pikaday({
        field: $('#date-to')[0],
        format: 'DD/MM/YYYY',
        firstDay: 1
    });

    $scope.getOrderRequest = function () {
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-getOrders.php";
        swal('Fetching your orders...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"userId": localStorage.userId}
        };
        $http(config).success(function (response) {
            console.log(response);
            swal.close();
            if (response !== null) {
                $scope.cartItems = response;
                $scope.showTotal = true;
                if (response.length >= 1) {
                    $scope.hasOrders = true;
                }
            } else {
                swal({
                    title: 'Unknown Error!',
                    text: "Cannot display your orders.",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                });
            }
        }).error(function () {
            swal({
                title: 'Internet Connection Error!',
                text: "Cannot display your orders.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(function () {
                console.log("OK");
            });
        });
    };

    $scope.getOrderRequest();

    //filter orders
    $scope.filterOrderRequest = function (form) {
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-filterOrders.php";
        swal('Fetching your orders...');
        $scope.cartItems = [];
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"userId": localStorage.userId, "filterFrom": $scope.dateFromInput, "filterTo": $scope.dateToInput}
        };
        $http(config).success(function (response) {
            console.log(response);
            swal.close();
            if (response !== null) {
                $scope.orderTitle = $scope.dateFromInput + " To " + $scope.dateToInput;
                $scope.cartItems = response;
                $('#filterOrderModal').rmodal('hide');
            } else {
                swal({
                    title: 'Unknown Error!',
                    text: "Cannot display your orders.",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                });
            }
        }).error(function () {
            swal({
                title: 'Internet Connection Error!',
                text: "Cannot display your orders.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(function () {
                console.log("OK");
            });
        });
    };

    //open filter model
    $scope.openFilterModel = function () {
        $('#filterOrderModal').rmodal('show');
    };

    //close filter model
    $scope.closeFilterModel = function () {
        $('#filterOrderModal').rmodal('hide');
    };
});

// login controller
boardroomApp.controller('loginController', function ($scope, $http, $location) {
    $scope.sidebarTitle = 'Top News';

    if (localStorage.userId) {
        location.href = "#/";
        return;
    }

    if (sessionStorage.sessionUserEmail) {
        $scope.email = sessionStorage.sessionUserEmail;
        $scope.pass = sessionStorage.sessionUserPass;
    }

    $scope.loginRequest = function (form) {
        //if (!$scope.contactForm.$valid) return;
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-userLogin.php";
        swal('Please wait...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"userEmail": $scope.email, "userPass": $scope.pass}
        };
        $http(config).success(function (response) {
            console.log(response);
            swal.showLoading();
            if (response.loginStatus == true) {
                localStorage.userName = response.userFirstName;
                localStorage.userPhone = response.userPhone;
                localStorage.userId = response.userId;
                swal({
                    title: 'Login Successful!',
                    text: "Welcome Back " + response.userFirstName,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    location.href = "#/";
                });
            } else {
                swal({
                    title: 'Invalid Details!',
                    text: "Please Try Again!",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                });
            }
        }).error(function () {
            console.log("Hello");
        });
    };
});

// register controller
boardroomApp.controller('registerController', function ($scope, $http, $location) {
    $scope.sidebarTitle = 'Top News';
    $scope.registerRequest = function (form) {
        //if (!$scope.contactForm.$valid) return;
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-userRegister.php";
        swal('Please wait...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"userFirstName": $scope.fname, "userLastName": $scope.lname, "userEmail": $scope.email, "userPhone": $scope.phone, "userCompany": $scope.company, "userPass": $scope.pass1}
        };
        $http(config).success(function (response) {
            console.log(response);
            swal.hideLoading();
            if (response.registrationStatus == true) {
                sessionStorage.sessionUserEmail = $scope.email;
                sessionStorage.sessionUserPass = $scope.pass;
                swal({
                    title: 'Registration Successful!',
                    text: "Welcome to Boardroom",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                    location.href = "#/login";
                });
            } else {
                swal({
                    title: 'Registration Failed!',
                    text: "Please Try Again",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    console.log("OK");
                });
            }
        }).error(function () {
            console.log("Hello");
        });
    };
});

// password controller
boardroomApp.controller('passwordController', function ($scope, $http) {
    $scope.resetPassRequest = function (form) {
        //if (!$scope.contactForm.$valid) return;
        console.log("Email = "+$scope.emailPass);
        var url = "http://mesmerizestudiokenya.com/boardroom/api/ios-resetPass.php";
        swal('Please wait...');
        swal.showLoading();
        var config = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            data: {"emailPass": $scope.emailPass}
        };
        $http(config).success(function (response) {
            console.log(response);
            swal.hideLoading();
            if (response.resetStatus == true) {
                swal({
                    title: 'Password sent to your email',
                    text: "Check your spam",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                    location.href = "#/login";
                });
            } else {
                swal({
                    title: 'Email not found!',
                    text: "Please Try Again",
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then(function () {
                });
            }
        }).error(function () {
            swal({
                text: "Connection Error!",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(function () {
            });
        });
    };
});

boardroomApp.controller('profileController', function ($scope, $http, $routeParams, $window) {
    // Page/Section Title
    $scope.sectionTitle = $routeParams.user_id;
    $scope.url = "http://api.hivisasa.com/articles/county/nakuru/category" + "/" + $scope.sectionTitle;
//    console.log($scope.url);
//    //get latest articles
//    $http({method: 'GET', url: $scope.url}).success(function (response) {
//        $scope.articles = response;
//        console.log(response);
//    });

});