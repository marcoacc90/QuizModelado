app.controller('HomeController',function($scope, $rootScope, $http, $sce){

  var isChrome = !!window.chrome && !!window.chrome.webstore;
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  $scope.isCreditHidden = true;
  $scope.credits = "";

  $scope.showCredits = function(){
    $scope.isCreditHidden = !$scope.isCreditHidden;

    if(!$scope.isCreditHidden){

      if (isChrome || isOpera) {
        $scope.credits = $sce.trustAsHtml("<marquee class=\"text-center\" width=\"100%\" height=\"100%\" scrolldelay=\"170\" direction=\"up\">"+$rootScope.credits_data.formated+"</marquee>");
      }else {
        $scope.credits = $sce.trustAsHtml("<marquee class=\"text-center\" width=\"100%\" height=\"100%\" truespeed scrolldelay=\"40\" scrollamount=\"1\" direction=\"up\">"+$rootScope.credits_data.formated+"</marquee>");
      }

    }
  };

  $scope.startQuiz = function(){
    $rootScope.current_template = 'resources/html/quiz.html';
  };

});
