
var app = angular.module("myapp", ["ngRoute",'ui.bootstrap']);
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "Subject.html",
    controller : "subjectsController"
  })
  .when("/quiz/:id/:name", {
    templateUrl : "quiz-app.htm",
    controller : "quizController"
  })

  .otherwise({
    redirect: '/'
  });
});

app.controller("subjectsController", function($scope,$http,$rootScope){
    $scope.list_subject = []
    $http.get('./db/Subjects.js').then(function(res){
        $scope.list_subject = res.data;
        var ht = sessionStorage.getItem("userlogin");
        if(ht!="")
        $rootScope.nameLogin = ht;
        $scope.curPage = 1,
        $scope.itemsPerPage = 4,
        $scope.maxSize = 5;
      
        this.items = $scope.list_subject;
    
    
        $scope.numOfPages = function () {
        return Math.ceil($scope.list_subject.length / $scope.itemsPerPage);
      
        };
    
        $scope.$watch('curPage + numPerPage', function() {
        var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
        end = begin + $scope.itemsPerPage;
      
        $scope.filteredItems = $scope.list_subject.slice(begin, end);
   
        });
    })
    // $scope.startPag = 0;
    // $scope.nextPag = function(){
    //     angular.forEach($scope.list_subject, function(value, key){
    //         console.log(key + ': ' + value);
    //    });
    //     $scope.startPag += 4;
    // }
    // $scope.itemPerPage =  4;
    // $scope.currentPage = 1;
    // $scope.startPage = 0;
    // $scope.endPage = $scope.itemPerPage;
    
  })
  app.controller("quizController", function($scope,$http,$routeParams,quizFactory){
    $http.get('./db/Quizs/'+$routeParams.id+'.js').then(function(res){
        var count = 0;
        quizFactory.questions = res.data;
    })
  })

app.directive('quiztemp',function(quizFactory,$routeParams){
    return{
        restrict : 'AE',
        scope:{},
        templateUrl:'template-quiz.html',
        link: function(scope){
            scope.QuesAnswered = [];
            scope.lastQuestion ;
            scope.checkkk = false;
            scope.arraytemp;
            scope.classNameFromList;
            scope.indextemp;
            scope.start = function(){
                quizFactory.getQuestions().then(function(){
                    scope.subjectName = $routeParams.name
                    scope.id = 0;
                    scope.inProgess = true;
                    scope.getQuestion();
                    scope.sizeQs =quizFactory.questions.length;
                    scope.quizOver = false;
                    scope.lastQuestion = quizFactory.questions.length - 1;
                    scope.QuesQuantity = quizFactory.questions;
                    scope.classNameFromList = "primary";
                })
            };
            scope.selectedIndex = -1;
            scope.itemClicked = function ($index) {
                scope.selectedIndex = $index;
                // scope.indextemp = $index;
              };
            // scope.setColorButton=function(){
            //     scope.classNameFromList
            // }
            scope.reset = function(){
                scope.inProgess = false;
                scope.score = 0;
                scope.wrongAns = 0;
                scope.QuesAnswered=[];
            }
            scope.getQuestion = function(){
                var quiz = quizFactory.getQuestion(scope.id);
                console.log(quiz);
                if(quiz){
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                    
                }
                // else{
                //     scope.quizOver = true;
                // }
               
            }
            scope.getQuestionFromList = function(id){
                var quiz = quizFactory.getQuestion(id);
                scope.id = id;
                if(quiz){
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                    
                }
                var quiz = quizFactory.getQuestion(scope.id);
                console.log(scope.id)
                var quesaaaa = scope.QuesAnswered;
                scope.resultt = "";
                
                    angular.forEach(quesaaaa, function(value, key) {
                        var arr = Object.values(value);
                        if(arr.indexOf(quiz.Id) !== -1) {
                            scope.answerMode = false;
                           
                        }
                        else{
                            scope.checkkk = false;
                        }
                        
                                
                          
                        
                    });
               
            }
            scope.completeQuiz = function(){
                scope.quizOver = true;
            }
            scope.checkAnswer = function(){
                var i = 0;
                var quiz = quizFactory.getQuestion(scope.id);
                if(scope.checkkk){
                    alert("Trả lời rồi");
                    return;
                }
                
                if(!$('input[name = answer]:checked').length)return;
                var ans = $('input[name = answer]:checked').val();
                if(ans == scope.answer){
                    scope.score++;
                    scope.correctAnswer = true;
                    
                }else{
                    scope.correctAnswer = false;
                    scope.wrongAns++;
                }
                scope.answerMode = false;
                
                scope.QuesAnswered.push(quizFactory.getQuestion(scope.id),{
                    "quizId": quiz.Id,
                    "answered": ans
                });
                scope.selectedIndex = scope.id;
                scope.nextQuestion();
            }
            scope.nextQuestion = function(){
                
                if(scope.id == quizFactory.questions.length){
                    scope.id = 0;
                    scope.getQuestion();
                    
                    scope.isabledd = true;
                }
                else{
                    scope.id++;
                    scope.selectedIndex = scope.id;
                    scope.getQuestion();
                }
                scope.checkkk = false;
                
                var quiz = quizFactory.getQuestion(scope.id);
                console.log(scope.id)
                var quesaaaa = scope.QuesAnswered;
                scope.resultt = "";
                
                    angular.forEach(quesaaaa, function(value, key) {
                        var arr = Object.values(value);
                        if(arr.indexOf(quiz.Id) !== -1) {
                            scope.answerMode = false;
                           
                        }
                        else{
                            scope.checkkk = false;
                        }
                        
                                
                          
                        
                    });
            }
            scope.previousQuestion = function(){
                scope.id--;
                scope.getQuestion();
                scope.selectedIndex = scope.id;
                scope.checkkk = false;
                var quiz = quizFactory.getQuestion(scope.id);
                // for( i = 0 ; i < scope.QuesAnswered;i++){
                //     if(i.Id == quiz.Id){
                //         alert(i.Id);
                //         return;
                //     }
                // }
                var quesaaaa = scope.QuesAnswered;
                scope.resultt = "";
                console.log(scope.QuesAnswered)
                    angular.forEach(quesaaaa, function(value, key) {
                        var arr = Object.values(value);
                        if(arr.indexOf(quiz.Id) !== -1) {
                            scope.answerMode = false;
                            angular.forEach(scope.QuesAnswered, function(item){
                                if(item.quizId == quiz.Id){
                                    console.log("quiz id: "+quiz.Id)
                                    console.log("item quiz "+item.quizId)
                                    console.log("item ans "+item.answered)
                                    var value = item.answered;
                                    $("input:radio[name=answer]").filter('[value='+value+']').prop('checked', true);
                                    // $("input:radio[name = answer][value=" + 104121 + "]").attr('checked', 'checked');
                             
                                }
                            });
                        }
                        else{
                            scope.checkkk = false;
                        }
                        
                                
                          
                        
                    });
            }
            scope.fisrtQues = function(){
                scope.id = 0;
                scope.getQuestion();
                scope.selectedIndex = scope.id;
            }
            scope.lastQues = function(){
                scope.id  = quizFactory.questions.length - 1;
                scope.getQuestion();
                scope.selectedIndex = scope.id;
            }
            scope.reset();
        }
    }
})


app.factory('quizFactory',function($http,$routeParams){
    //$http.get('./db/Quizs/ADAV.js').then(function(res){
        //questions = res.data;
       
    //})
    
    return {
        getQuestions:function(){
            return $http.get('./db/Quizs/'+$routeParams.id+'.js').then(function(res){
                questions = res.data;
            });
        },
        getQuestion:function(id){
            var randomItem = questions[Math.floor(Math.random()*questions.length)]
            var count = questions.length;
            // if(count > 0){
            //     count = 10;
            // }
            return questions[id];
            // if(id<count){
            //     return randomItem   ;
            // }else{
            //     return false;
            // }
        }
    }
})