app.controller("subjectsController", function($scope, $http, $rootScope, $window, $route) {
	$scope.list_subject = [] // tao list luu subject
	$http.get('./db/Subjects.js').then(function(res) {
		$scope.list_subject = res.data; //lay data tu file luu vao mang
		var ht = sessionStorage.getItem("userlogin");

		if (ht != "")
			$rootScope.nameLogin = ht;

		console.log($rootScope.nameLogin)
		//PAGINATION///////////////////////////////
		$scope.curPage = 1, //page hien tai
			$scope.itemsPerPage = 4, //item trong 1 page
			$scope.maxSize = 5;

		this.items = $scope.list_subject;

		// so luong page
		$scope.numOfPages = function() {
			return Math.ceil($scope.list_subject.length / $scope.itemsPerPage);
		};

		$scope.$watch('curPage + numPerPage', function() {
			var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
				end = begin + $scope.itemsPerPage;

			$scope.filteredItems = $scope.list_subject.slice(begin, end);

		});
		//PAGINATION///////////////////////
	})
	$rootScope.logout = function() {
		sessionStorage.clear();

		$route.reload();
	}
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
	$rootScope.FBLogout = function() {

	}
})
app.controller("quizController", function($scope, $http, $routeParams, quizFactory) {
	$http.get('./db/Quizs/' + $routeParams.id + '.js').then(function(res) {
		var count = 0;
		quizFactory.questions = res.data;
		console.log(quizFactory.questions)
	})
})

app.directive('quiztemp', function(quizFactory, $routeParams, $timeout, $window) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template-quiz.html',
		link: function(scope) {
			scope.QuesAnswered = []; //tao mang luu cau hoi da tra loi
			scope.lastQuestion; // cau hoi cuoi cung
			scope.checkkk = false;
			scope.arraytemp; // mang tam
			scope.classNameFromList; //class name
			scope.indextemp;
			scope.AnsweredQues;
			scope.start = function() { // click start()
				quizFactory.getQuestions().then(function() {
					scope.subjectName = $routeParams.name //lay ten tu link
					scope.logoName = $routeParams.logo // lay logo tu link
					scope.id = 0; // id cau hoi
					scope.inProgess = true; // inprocess = true (dang lam quiz)
					scope.getQuestion(); //get cau hoi
					scope.sizeQs = quizFactory.questions.length; //so luong cau hoi
					scope.quizOver = false; // an nut hoan thanh
					scope.lastQuestion = quizFactory.questions.length - 1; // cau hoi cuoi cung
					scope.QuesQuantity = quizFactory.questions; // so luong cau hoi
					scope.classNameFromList = "primary";
					scope.counter = 1800; // dem thoi gian
				})
			};
			scope.on = function() {
				document.getElementById("overlay").style.display = "block";
			}

			scope.off = function() {
				document.getElementById("overlay").style.display = "none";
			}
			//dem thoi gian den khi het quiz
			scope.onTimeout = function() {
				if (scope.counter > 0) scope.counter--;
				mytimeout = $timeout(scope.onTimeout, 1000);
				if (scope.counter == 0) {
					scope.completeQuiz()
				}
			}
			var mytimeout = $timeout(scope.onTimeout, 1000);
			scope.selectedIndex = 0;
			scope.itemClicked = function($index) {
				scope.selectedIndex = $index;
				// scope.indextemp = $index;
			};
			// scope.setColorButton=function(){
			//     scope.classNameFromList
			// }
			scope.reset = function() { // reset cau hoi
				scope.inProgess = false; //
				scope.score = 0; // diem ve 0
				scope.wrongAns = 0; // tong hop cau hoi sai ve 0
				scope.QuesAnswered = []; // mang cau hoi da tra loi ve 0
			}
			scope.getQuestion = function() { // goi cau hoi tu id
				var quiz = quizFactory.getQuestion(scope.id);
				scope.AnsweredQues = quiz;
				console.log(quiz);
				if (quiz) {
					scope.question = quiz.Text; // cau hoi
					scope.options = quiz.Answers; // cac dau tra loi
					scope.answer = quiz.AnswerId; // id dap an				
				}
				// else{
				//     scope.quizOver = true;
				// }

			}
			scope.getQuestionFromList = function(id) { // load cau hoi tu list
				scope.id = id;
				scope.selectedIndex = scope.id;
				scope.getQuestion();
				scope.disableIfItAnswered();
				// angular.forEach(quesaaaa, function(value, key) {
				// 	var arr = Object.values(value);
				// 	if (arr.indexOf(quiz.Id) !== -1) {
				// 		scope.answerMode = false;

				// 	} else {
				// 		scope.checkkk = false;
				// 	}
				// });
			}
			scope.submitOn = true;
			scope.completeQuiz = function() {
				scope.quizOver = true;
				scope.QuizHistory = scope.QuesAnswered;
				console.log(scope.QuizHistory);
			}
			scope.checkQs = function(id) {
				console.log(scope.AnsweredQues)
				scope.AnsweredQues.traloi = id;
				console.log(scope.AnsweredQues.traloi);

			}
			scope.disableIfItAnswered = function() {
				if (scope.AnsweredQues.datraloi == true) {
					scope.submitOn = false;
				} else {
					scope.submitOn = true;
				}
				console.log("submiton " + scope.submitOn)
			}
			scope.checkAnswer = function() {
				var i = 0;
				var quiz = quizFactory.getQuestion(scope.id);
				if (scope.checkkk) {
					alert("Trả lời rồi");
					return;
				}

				if (!$('input[name = answer]:checked').length) return;
				var ans = $('input[name = answer]:checked').val();
				if (ans == scope.answer) {
					scope.score++;
					scope.correctAnswer = true;
					
				} else {
					scope.correctAnswer = false;
					scope.wrongAns++;
				}
				scope.AnsweredQues.datraloi = true;
				scope.answerMode = false;

				scope.QuesAnswered.push(quizFactory.getQuestion(scope.id));
				scope.selectedIndex = scope.id;
				console.log(quizFactory.questions)
				scope.disableIfItAnswered();
				if (scope.id == quizFactory.questions.length - 1) {
					return;
				}
				scope.nextQuestion();
			}
			scope.nextQuestion = function() {

				if (scope.id == quizFactory.questions.length) {
					return;
				} else {
					scope.id++;
					scope.selectedIndex = scope.id;
					scope.getQuestion();
				}
				scope.checkkk = false;
				scope.disableIfItAnswered();
			}
			scope.previousQuestion = function() {
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
				scope.disableIfItAnswered();
			}
			scope.fisrtQues = function() {
				scope.id = 0;
				scope.getQuestion();
				scope.selectedIndex = scope.id;
				var quiz = quizFactory.getQuestion(scope.id);
				console.log(scope.id)
				var quesaaaa = scope.QuesAnswered;
				scope.resultt = "";
				scope.disableIfItAnswered();
			}
			scope.lastQues = function() {
				scope.id = quizFactory.questions.length - 1;
				scope.getQuestion();
				scope.selectedIndex = scope.id;
				var quiz = quizFactory.getQuestion(scope.id);
				console.log(scope.id)
				var quesaaaa = scope.QuesAnswered;
				scope.resultt = "";
				scope.disableIfItAnswered();
			}

			scope.redirectToIndex = function() {
				$window.location.href = "./index.html"
			}
			scope.reset();
		}
	}
})

app.filter('secondsToDateTime', [function() {
	return function(seconds) {
		return new Date(1970, 0, 1).setSeconds(seconds);
	};
}])
app.factory('quizFactory', function($http, $routeParams) {

	return {
		//get all question from file
		getQuestions: function() {
			return $http.get('./db/Quizs/' + $routeParams.id + '.js').then(function(res) {
				questions = res.data;
			});
		},
		//get 1 question from array
		getQuestion: function(id) {
			var randomItem = questions[Math.floor(Math.random() * questions.length)]
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