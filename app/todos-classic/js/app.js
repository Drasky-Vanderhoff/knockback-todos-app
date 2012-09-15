// Generated by CoffeeScript 1.3.3
(function() {
  var ENTER_KEY;

  ENTER_KEY = 13;

  window.TodoApp = function() {
    var router,
      _this = this;
    window.app = this;
    this.collections = {
      todos: new TodoCollection()
    };
    this.collections.todos.fetch();
    this.settings = {
      list_filter_mode: ko.observable('')
    };
    this.todos = kb.collectionObservable(this.collections.todos, {
      view_model: TodoViewModel
    });
    this.collections.todos.bind('change', function() {
      return _this.todos.notifySubscribers(_this.todos());
    });
    this.tasks_exist = ko.computed(function() {
      return _this.todos().length;
    });
    this.title = ko.observable('');
    this.onAddTodo = function(view_model, event) {
      if (!$.trim(_this.title()) || (event.keyCode !== ENTER_KEY)) {
        return true;
      }
      _this.collections.todos.create({
        title: $.trim(_this.title())
      });
      return _this.title('');
    };
    this.all_completed = ko.computed({
      read: function() {
        return !_this.todos.collection().remainingCount();
      },
      write: function(completed) {
        return _this.todos.collection().completeAll(completed);
      }
    });
    this.remaining_text = ko.computed(function() {
      return "<strong>" + (_this.todos.collection().remainingCount()) + "</strong> " + (_this.todos.collection().remainingCount() === 1 ? 'item' : 'items') + " left";
    });
    this.clear_text = ko.computed(function() {
      var count;
      if ((count = _this.todos.collection().completedCount())) {
        return "Clear completed (" + count + ")";
      } else {
        return '';
      }
    });
    this.onDestroyCompleted = function() {
      return _this.collections.todos.destroyCompleted();
    };
    router = new Backbone.Router;
    router.route('', null, function() {
      return _this.settings.list_filter_mode('');
    });
    router.route('active', null, function() {
      return _this.settings.list_filter_mode('active');
    });
    router.route('completed', null, function() {
      return _this.settings.list_filter_mode('completed');
    });
    Backbone.history.start();
  };

}).call(this);
