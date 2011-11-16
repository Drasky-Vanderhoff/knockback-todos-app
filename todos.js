/*
  knockback-todos.js
  (c) 2011 Kevin Malakoff.
  Knockback-Todos is freely distributable under the MIT license.
  See the following for full license details:
    https:#github.com/kmalakoff/knockback-todos/blob/master/LICENSE
*/
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  var CreateTodoViewModel, LanguageOptionViewModel, LanguagesViewModel, PrioritiesSetting, PrioritiesSettingList, PrioritySettingsViewModel, SettingsViewModel, SortingOptionViewModel, StatsViewModel, Todo, TodoList, TodoListViewModel, TodoViewModel, create_view_model, footer_view_model, header_view_model, languages_view_model, priorities, stats_view_model, todo_list_view_model, todos, _ko_native_apply_bindings;
  kb.locale_manager.setLocale('en');
  kb.locale_change_observable = kb.triggeredObservable(kb.locale_manager, 'change');
  ko.bindingHandlers.dblclick = {
    init: function(element, value_accessor, all_bindings_accessor, view_model) {
      return $(element).dblclick(ko.utils.unwrapObservable(value_accessor()));
    }
  };
  if (_.isUndefined(ko.templateSources)) {
    _ko_native_apply_bindings = ko.applyBindings;
    ko.applyBindings = function(view_model, element) {
      view_model['$data'] = view_model;
      return _ko_native_apply_bindings(view_model, element);
    };
  }
  PrioritiesSetting = (function() {
    __extends(PrioritiesSetting, Backbone.Model);
    function PrioritiesSetting() {
      PrioritiesSetting.__super__.constructor.apply(this, arguments);
    }
    return PrioritiesSetting;
  })();
  PrioritiesSettingList = (function() {
    __extends(PrioritiesSettingList, Backbone.Collection);
    function PrioritiesSettingList() {
      PrioritiesSettingList.__super__.constructor.apply(this, arguments);
    }
    PrioritiesSettingList.prototype.model = PrioritiesSetting;
    PrioritiesSettingList.prototype.localStorage = new Store("kb_priorities");
    return PrioritiesSettingList;
  })();
  priorities = new PrioritiesSettingList();
  LanguageOptionViewModel = function(locale) {
    this.id = locale;
    this.label = kb.locale_manager.localeToLabel(locale);
    this.option_group = 'lang';
    return this;
  };
  LanguagesViewModel = function(locales) {
    this.language_options = ko.observableArray(_.map(locales, function(locale) {
      return new LanguageOptionViewModel(locale);
    }));
    this.current_language = ko.observable(kb.locale_manager.getLocale());
    this.selected_value = ko.dependentObservable({
      read: __bind(function() {
        return this.current_language();
      }, this),
      write: __bind(function(new_locale) {
        kb.locale_manager.setLocale(new_locale);
        return this.current_language(new_locale);
      }, this),
      owner: this
    });
    return this;
  };
  languages_view_model = new LanguagesViewModel(kb.locale_manager.getLocales());
  ko.applyBindings(languages_view_model, $('#todo-languages')[0]);
  PrioritySettingsViewModel = function(model) {
    this.priority = kb.observable(model, {
      key: 'id'
    });
    this.priority_text = ko.dependentObservable(__bind(function() {
      kb.locale_change_observable();
      return kb.locale_manager.get(this.priority());
    }, this));
    this.priority_color = kb.observable(model, {
      key: 'color'
    });
    return this;
  };
  SettingsViewModel = function(priority_settings) {
    this.priority_settings = ko.observableArray(_.map(priority_settings, function(model) {
      return new PrioritySettingsViewModel(model);
    }));
    this.getColorByPriority = function(priority) {
      var view_model, _i, _len, _ref;
      this.createColorsDependency();
      _ref = this.priority_settings();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view_model = _ref[_i];
        if (view_model.priority() === priority) {
          return view_model.priority_color();
        }
      }
      return '';
    };
    this.createColorsDependency = __bind(function() {
      var view_model, _i, _len, _ref, _results;
      _ref = this.priority_settings();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view_model = _ref[_i];
        _results.push(view_model.priority_color());
      }
      return _results;
    }, this);
    this.default_priority = ko.observable('medium');
    this.default_priority_color = ko.dependentObservable(__bind(function() {
      return this.getColorByPriority(this.default_priority());
    }, this));
    this.priorityToRank = function(priority) {
      switch (priority) {
        case 'high':
          return 0;
        case 'medium':
          return 1;
        case 'low':
          return 2;
      }
    };
    return this;
  };
  window.settings_view_model = new SettingsViewModel([new Backbone.ModelRef(priorities, 'high'), new Backbone.ModelRef(priorities, 'medium'), new Backbone.ModelRef(priorities, 'low')]);
  SortingOptionViewModel = function(string_id) {
    this.id = string_id;
    this.label = kb.observable(kb.locale_manager, {
      key: string_id
    });
    this.option_group = 'list_sort';
    return this;
  };
  Todo = (function() {
    __extends(Todo, Backbone.Model);
    function Todo() {
      Todo.__super__.constructor.apply(this, arguments);
    }
    Todo.prototype.defaults = function() {
      return {
        created_at: new Date()
      };
    };
    Todo.prototype.set = function(attrs) {
      if (attrs && attrs.hasOwnProperty('done_at') && _.isString(attrs['done_at'])) {
        attrs['done_at'] = new Date(attrs['done_at']);
      }
      if (attrs && attrs.hasOwnProperty('created_at') && _.isString(attrs['created_at'])) {
        attrs['created_at'] = new Date(attrs['created_at']);
      }
      return Todo.__super__.set.apply(this, arguments);
    };
    Todo.prototype.isDone = function() {
      return !!this.get('done_at');
    };
    Todo.prototype.done = function(done) {
      return this.save({
        done_at: done ? new Date() : null
      });
    };
    return Todo;
  })();
  TodoList = (function() {
    __extends(TodoList, Backbone.Collection);
    function TodoList() {
      TodoList.__super__.constructor.apply(this, arguments);
    }
    TodoList.prototype.model = Todo;
    TodoList.prototype.localStorage = new Store("kb_todos");
    TodoList.prototype.doneCount = function() {
      return this.models.reduce((function(prev, cur) {
        return prev + (!!cur.get('done_at') ? 1 : 0);
      }), 0);
    };
    TodoList.prototype.remainingCount = function() {
      return this.models.length - this.doneCount();
    };
    TodoList.prototype.allDone = function() {
      return this.filter(function(todo) {
        return !!todo.get('done_at');
      });
    };
    return TodoList;
  })();
  todos = new TodoList();
  todos.fetch();
  header_view_model = {
    title: "Todos"
  };
  ko.applyBindings(header_view_model, $('#todo-header')[0]);
  CreateTodoViewModel = function() {
    this.input_text = ko.observable('');
    this.input_placeholder_text = kb.observable(kb.locale_manager, {
      key: 'placeholder_create'
    });
    this.input_tooltip_text = kb.observable(kb.locale_manager, {
      key: 'tooltip_create'
    });
    this.addTodo = function(event) {
      var text;
      text = this.input_text();
      if (!text || event.keyCode !== 13) {
        return true;
      }
      todos.create({
        text: text,
        priority: settings_view_model.default_priority()
      });
      return this.input_text('');
    };
    this.priority_color = ko.dependentObservable(function() {
      return window.settings_view_model.default_priority_color();
    });
    this.onSelectPriority = __bind(function(priority) {
      if (event) {
        event.stopPropagation();
      }
      this.tooltip_visible(false);
      return settings_view_model.default_priority(ko.utils.unwrapObservable(priority));
    }, this);
    this.tooltip_visible = ko.observable(false);
    this.onToggleTooltip = __bind(function() {
      return this.tooltip_visible(!this.tooltip_visible());
    }, this);
    return this;
  };
  create_view_model = new CreateTodoViewModel();
  ko.applyBindings(create_view_model, $('#todo-create')[0]);
  TodoViewModel = function(model) {
    this.text = kb.observable(model, {
      key: 'text',
      write: (function(text) {
        return model.save({
          text: text
        });
      })
    }, this);
    this.edit_mode = ko.observable(false);
    this.toggleEditMode = __bind(function() {
      if (!this.done()) {
        return this.edit_mode(!this.edit_mode());
      }
    }, this);
    this.onEnterEndEdit = __bind(function(event) {
      if (event.keyCode === 13) {
        return this.toggleEditMode();
      }
    }, this);
    this.created_at = model.get('created_at');
    this.done = kb.observable(model, {
      key: 'done_at',
      read: (function() {
        return model.isDone();
      }),
      write: (function(done) {
        return model.done(done);
      })
    }, this);
    this.done_at = kb.observable(model, {
      key: 'done_at',
      localizer: function(value) {
        return new LongDateLocalizer(value);
      }
    });
    this.done_text = ko.dependentObservable(__bind(function() {
      var done_at;
      done_at = this.done_at();
      if (!!done_at) {
        return "" + (kb.locale_manager.get('label_completed')) + ": " + done_at;
      } else {
        return '';
      }
    }, this));
    this.priority_color = kb.observable(model, {
      key: 'priority',
      read: function() {
        return settings_view_model.getColorByPriority(model.get('priority'));
      }
    });
    this.onSelectPriority = __bind(function(priority) {
      if (event) {
        event.stopPropagation();
      }
      this.tooltip_visible(false);
      return model.save({
        priority: ko.utils.unwrapObservable(priority)
      });
    }, this);
    this.tooltip_visible = ko.observable(false);
    this.onToggleTooltip = __bind(function() {
      return this.tooltip_visible(!this.tooltip_visible());
    }, this);
    this.destroyTodo = __bind(function() {
      return model.destroy();
    }, this);
    return this;
  };
  TodoListViewModel = function(todos) {
    this.todos = ko.observableArray([]);
    this.sort_mode = ko.observable('label_text');
    this.sorting_options = [new SortingOptionViewModel('label_text'), new SortingOptionViewModel('label_created'), new SortingOptionViewModel('label_priority')];
    this.selected_value = ko.dependentObservable({
      read: __bind(function() {
        return this.sort_mode();
      }, this),
      write: __bind(function(new_mode) {
        this.sort_mode(new_mode);
        switch (new_mode) {
          case 'label_text':
            return this.collection_observable.sortAttribute('text');
          case 'label_created':
            return this.collection_observable.sortedIndex(function(models, model) {
              return _.sortedIndex(models, model, function(test) {
                return test.get('created_at').valueOf();
              });
            });
          case 'label_priority':
            return this.collection_observable.sortedIndex(function(models, model) {
              return _.sortedIndex(models, model, function(test) {
                return settings_view_model.priorityToRank(test.get('priority'));
              });
            });
        }
      }, this),
      owner: this
    });
    this.collection_observable = kb.collectionObservable(todos, this.todos, {
      view_model: TodoViewModel,
      sort_attribute: 'text'
    });
    this.sort_visible = ko.dependentObservable(__bind(function() {
      return this.collection_observable().length;
    }, this));
    return this;
  };
  todo_list_view_model = new TodoListViewModel(todos);
  ko.applyBindings(todo_list_view_model, $('#todo-list')[0]);
  footer_view_model = {
    instructions_text: kb.observable(kb.locale_manager, {
      key: 'instructions'
    })
  };
  ko.applyBindings(footer_view_model, $('#todo-footer')[0]);
  StatsViewModel = function(todos) {
    this.collection_observable = kb.collectionObservable(todos);
    this.remaining_text = ko.dependentObservable(__bind(function() {
      var count;
      kb.locale_change_observable();
      count = this.collection_observable.collection().remainingCount();
      if (!count) {
        return '';
      }
      return kb.locale_manager.get((count === 1 ? 'remaining_template_s' : 'remaining_template_pl'), count);
    }, this));
    this.clear_text = ko.dependentObservable(__bind(function() {
      var count;
      kb.locale_change_observable();
      count = this.collection_observable.collection().doneCount();
      if (!count) {
        return '';
      }
      return kb.locale_manager.get((count === 1 ? 'clear_template_s' : 'clear_template_pl'), count);
    }, this));
    this.onDestroyDone = __bind(function() {
      var model, _i, _len, _ref, _results;
      _ref = todos.allDone();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        _results.push(model.destroy());
      }
      return _results;
    }, this);
    return this;
  };
  stats_view_model = new StatsViewModel(todos);
  ko.applyBindings(stats_view_model, $('#todo-stats')[0]);
  return _.delay((function() {
    priorities.fetch({
      success: function(collection) {
        if (!collection.get('high')) {
          collection.create({
            id: 'high',
            color: '#c00020'
          });
        }
        if (!collection.get('medium')) {
          collection.create({
            id: 'medium',
            color: '#c08040'
          });
        }
        if (!collection.get('low')) {
          return collection.create({
            id: 'low',
            color: '#00ff60'
          });
        }
      }
    });
    $('.colorpicker').mColorPicker();
    return $('.colorpicker').bind('colorpicked', function() {
      var model;
      model = priorities.get($(this).attr('id'));
      if (model) {
        return model.save({
          color: $(this).val()
        });
      }
    });
  }), 1000);
});