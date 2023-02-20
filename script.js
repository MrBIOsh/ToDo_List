class ToDo {
  constructor() {
    this.todoS = [];
    this.filter = 0;
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback;
  }

  _commit(todoS = this.todoS) {
    this.onTodoListChanged(todoS);
  }

  add(todoText) {
    var todo = {
      id: this.todoS.length > 0 ? this.todoS[this.todoS.length - 1].id + 1 : 0,
      text: todoText,
    };

    this.todoS.push(todo);
    this._commit(this.todoS);

  }
}

class View {

  constructor() {
    this.input = document.getElementById('taskInput');
    this.filter = document.getElementById('todo__filter');
    this.list = document.getElementById('todo__list');
  }

  get _todoText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = '';
  }

  createElement(tag, className) {
    var element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  displayTodoS(todoS) {

    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }

    if (todoS.length !== 0) {
      todoS.forEach((todo) => {
        var li = this.createElement('li', 'todo__item'),
            spanText = this.createElement('span', 'todo__task'),
            spanRestore = this.createElement('span', 'todo__action'),
            spanComplete = this.createElement('span', 'todo__action'),
            spanDelete = this.createElement('span', 'todo__action');

        spanRestore.classList.add('todo__action_restore');
        spanComplete.classList.add('todo__action_complete');
        spanDelete.classList.add('todo__action_delete');

        li.id = todo.id;

        li.dataset.todoState = 'active';

        spanRestore.dataset.todoAction = 'active';
        spanComplete.dataset.todoAction = 'completed';
        spanDelete.dataset.todoAction = 'deleted';
        
        spanText.textContent = todo.text;

        li.append(spanText, spanRestore, spanComplete, spanDelete);

        this.list.append(li);
      });
    }
  }

  bindAddTodo(handler) {
      if (this._todoText) {
        handler(this._todoText);
        this._resetInput();
      }
  }

  update() {
    const option = document.querySelector('.todo__options').value;
    document.querySelector('.todo__items').dataset.todoOption = option;
    document.querySelector('.todo__text').disabled = option !== 'active';
  }

  save() {
    localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
  }

}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
    this.onTodoListChanged(this.model.todoS);
  }

  init() {
    const fromStorage = localStorage.getItem('todo');
    if (fromStorage) {
      this.view.list.innerHTML = fromStorage;
    }
    this.view.filter.addEventListener('change', this.view.update);
    document.addEventListener('click', this.action.bind(this));
  }

  add() {
    this.model.bindTodoListChanged(this.onTodoListChanged);
    this.view.bindAddTodo((todoText) => {
      this.model.add(todoText);
    });
  };

  onTodoListChanged = (todoS) => {
    console.log(todoS);
    this.view.displayTodoS(todoS);
  };

  action(e) {
    const target = e.target;
    if (target.classList.contains('todo__action')) {
      const action = target.dataset.todoAction;
      const elemItem = target.closest('.todo__item');
      if (action === 'deleted' || elemItem.dataset.todoState === 'deleted') {
        this.model.todoS.splice(elemItem.id, 1)
        elemItem.remove();
        console.log(this.model.todoS);
      } else {
        elemItem.dataset.todoState = action;
      }
      this.view.save();
    } else if (target.classList.contains('todo__add')) {
      this.add();
      this.view.save();
    }
  }
}



const toDo = new Controller(new ToDo(), new View())



/*
const todo = {
    action(e) {
      const target = e.target;
      if (target.classList.contains('todo__action')) {
        const action = target.dataset.todoAction;
        const elemItem = target.closest('.todo__item');
        if (action === 'deleted' || elemItem.dataset.todoState === 'deleted') {
          elemItem.remove();
        } else {
          elemItem.dataset.todoState = action;
        }
        this.save();
      } else if (target.classList.contains('todo__add')) {
        this.add();
        this.save();
      }
    },
    add() {
      const elemText = document.querySelector('.todo__text');
      if (elemText.disabled || !elemText.value.length) {
        return;
      }
      document.querySelector('.todo__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
      elemText.value = '';
    },
    create(text) {
      return `<li class="todo__item" data-todo-state="active">
        <span class="todo__task">${text}</span>
        <span class="todo__action todo__action_restore" data-todo-action="active"></span>
        <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
        <span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
    },
    init() {
      const fromStorage = localStorage.getItem('todo');
      if (fromStorage) {
        document.querySelector('.todo__items').innerHTML = fromStorage;
      }
      document.querySelector('.todo__options').addEventListener('change', this.update);
      document.addEventListener('click', this.action.bind(this));
    },
    update() {
      const option = document.querySelector('.todo__options').value;
      document.querySelector('.todo__items').dataset.todoOption = option;
      document.querySelector('.todo__text').disabled = option !== 'active';
    },
    save() {
      localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
    }
  }
  
  todo.init();*/
