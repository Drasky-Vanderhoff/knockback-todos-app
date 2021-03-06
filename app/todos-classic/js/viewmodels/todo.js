// Generated by CoffeeScript 1.6.2
(function() {
  window.TodoViewModel = function(model) {
    var _this = this;

    this.editing = ko.observable(false);
    this.completed = kb.observable(model, {
      key: 'completed',
      read: (function() {
        return model.completed();
      }),
      write: (function(completed) {
        return model.completed(completed);
      })
    }, this);
    this.title = kb.observable(model, {
      key: 'title',
      write: (function(title) {
        if ($.trim(title)) {
          model.save({
            title: $.trim(title)
          });
        } else {
          _.defer(function() {
            return model.destroy();
          });
        }
        return _this.editing(false);
      })
    }, this);
    this.onDestroyTodo = function() {
      return model.destroy();
    };
    this.onCheckEditBegin = function() {
      if (!_this.editing() && !_this.completed()) {
        _this.editing(true);
        return $('.todo-input').focus();
      }
    };
    this.onCheckEditEnd = function(view_model, event) {
      if ((event.keyCode === 13) || (event.type === 'blur')) {
        $('.todo-input').blur();
        return _this.editing(false);
      }
    };
  };

}).call(this);
