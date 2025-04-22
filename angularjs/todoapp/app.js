angular.module('todoApp', [])
  .controller('TodoController', ['$scope', function($scope) {
    // 기본 Todo 목록
    $scope.todos = [
      { text: 'Learn AngularJS', dueDate: '2024-11-30', completed: false },
      { text: 'Build a todo app', dueDate: '2024-11-29', completed: false }
    ];
    
    // 완료된 할 일 목록
    $scope.completedTodos = [];

    // 할 일 추가 함수
    $scope.addTodo = function() {
      if ($scope.newTodo && $scope.newDueDate) {
        $scope.todos.push({
          text: $scope.newTodo,
          dueDate: $scope.newDueDate,
          completed: false
        });
        $scope.newTodo = '';
        $scope.newDueDate = '';
      }
    };

    // 완료 상태로 변경하는 함수
    $scope.markAsCompleted = function(todo) {
      todo.completed = true;
      $scope.completedTodos.push(todo);
      $scope.todos = $scope.todos.filter(t => t !== todo);
    };

    // 완료된 할 일 삭제 함수
    $scope.removeCompletedTodo = function(todo) {
      $scope.completedTodos = $scope.completedTodos.filter(t => t !== todo);
    };

    // 할 일 삭제 함수
    $scope.removeTodo = function(todo) {
      $scope.todos = $scope.todos.filter(t => t !== todo);
    };

    // 남은 시간 계산 함수 (예시)
    $scope.timeRemaining = function(todo) {
      const now = new Date();
      const dueDate = new Date(todo.dueDate);
      const diff = dueDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return days + ' days left';
    };
    
    // 날짜 형식화 (예시)
    $scope.formatDate = function(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    };

    // 정렬 기준 및 방향 설정
    $scope.sortField = 'text';
    $scope.sortReverse = false;
    $scope.sortBy = function(field) {
      if ($scope.sortField === field) {
        $scope.sortReverse = !$scope.sortReverse;
      } else {
        $scope.sortField = field;
        $scope.sortReverse = false;
      }
    };

    // overdue 판단 함수
    $scope.isOverdue = function(todo) {
      const now = new Date();
      const dueDate = new Date(todo.dueDate);
      return dueDate < now && !todo.completed;
    };
  }]);
  