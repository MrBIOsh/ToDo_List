class ToDo {
  constructor(view) {
    this.view = view;
    this.list = document.querySelector('.todo__items');
    this.filter = document.querySelector('.todo__options');
    this.elemText = document.querySelector('.todo__text');
  }

  add() {
    if (this.elemText.disabled || !this.elemText.value.length) {
      return;
    }
    this.list.insertAdjacentHTML('beforeend', this.view.create(this.elemText.value));
    this.elemText.value = '';
  }

  update() {
    const option = document.querySelector('.todo__options').value;
    document.querySelector('.todo__items').dataset.todoOption = option;
    document.querySelector('.todo__text').disabled = option !== 'active';
  }

  save() {
    localStorage.setItem('todo', this.list.innerHTML);
  }
}

class View {

  create(text) {
    return `<li class="todo__item" data-todo-state="active">
      <span class="todo__task">${text}</span>
      <span class="todo__action todo__action_restore" data-todo-action="active"></span>
      <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
      <span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    const fromStorage = localStorage.getItem('todo');
    if (fromStorage) {
      this.model.list.innerHTML = fromStorage;
    }
    this.model.filter.addEventListener('change', this.model.update);
    document.addEventListener('click', this.action.bind(this));
  }

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
      this.model.save();
    } else if (target.classList.contains('todo__add')) {
      this.model.add();
      this.model.save();
    }
  }
}
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

  const toDo = new Controller(new ToDo(new View()), new View())