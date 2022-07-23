const $formInput = $(".add-task__input");
const $mainWrap = $(".main-wrap");
const $list = $("#list");

class TodoList {
  constructor($el, $data) {
    this.$el = $el;
    this.$input = $data;
    this.$todos = [];
    $($mainWrap).on("click", ".add-task__button", () => {
      if (this.$input.val() === "") return;
      this.postTask(this.$input.val());
      $formInput.val("");
    });
    $($mainWrap).on("click", ".set-status", (e) => {
      let $isClicked;
      if (e.target.parentElement.classList.contains("in-progress")) {
        $isClicked = true;
      } else {
        $isClicked = false;
      }
      this.changeStatus(e.target.parentElement.dataset.id, $isClicked);
    });
  }

  postTask(value) {
    $.ajax({
      url: "http://localhost:3000/todos",
      type: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        task: value,
        complited: false,
      }),
    })
      .done((e) => {
        this.addTodo(e);
      })
      .fail((err) => {
        console.log(err);
      });
  }

  addTodo(data) {
    this.$todos.push(data);
    this.render(this.$todos);
  }

  getTodos() {
    $.ajax({
      url: "http://localhost:3000/todos",
      dataType: "json",
    })
      .done((data) => {
        data.map((el) => {
          this.addTodo(el);
        });
      })
      .fail((err) => {
        console.log(err);
      });
  }

  changeStatus(id, status) {
    $.ajax({
      url: `http://localhost:3000/todos/${id}`,
      type: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        complited: status,
      }),
    })
      .done((e) => {
        console.log(e.id);
        let index = this.$todos.findIndex((el) => el.id == e.id);
        this.$todos[index].complited = !this.$todos[index].complited;
        this.render(this.$todos);
      })
      .fail((err) => {
        console.log(err);
      });
  }

  render($render = []) {
    let $lis = "";
    for (const el of $render) {
      if (!el) {
        return;
      }
      $lis += `
        <li data-id="${el.id}" class ="${
        el.complited ? "done" : "in-progress"
      } list__li">
          ${el.task}
         <button class="set-status">Change status</button>
         <button class="delete-task">Delete</button>
        </li>
      `;
    }
    this.$el.html($lis);
  }
}

let $todo = new TodoList($list, $formInput);

document.addEventListener("onLoad", $todo.getTodos());
