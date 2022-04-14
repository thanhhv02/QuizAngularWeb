
var app = angular.module("myapp", ["ngRoute",'ui.bootstrap']);
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "Subject.html",
    controller : "subjectsController"
  })
  .when("/quiz/:logo/:id/:name", {
    templateUrl : "quiz-app.htm",
    controller : "quizController"
  })

  .otherwise({
    redirect: '/'
  });
});

