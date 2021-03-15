import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Todo } from '../model/todo.model';
import { TodoService } from '../service/todo-data.service';
import { TodoList } from '../model/todo-list.model';
import { TodoListService } from '../service/todo-list.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  todoData: Todo[] = [];
  todoList: TodoList;
  public title: string;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private todoListService: TodoListService
  ) {}

  ngOnInit() {
    this.getTodoData();
    this.route.params.subscribe((params: Params) => {
      this.getTodoList(parseInt(params['id']));
    });
  }

  getTodoList(todoListId: number): void {
    console.log(todoListId);
    this.todoListService.getTodoListById(todoListId).subscribe((todoList) => {
      this.todoList = todoList;
    });
  }

  getTodoData(): void {
    this.todoService
      .getTodo()
      .subscribe((todoData: any) => (this.todoData = todoData.results));
  }

  completeTask(taskId: number): void {
    const task = this.todoData.find((data) => data.id === taskId);
    delete task.task_list;
    this.todoService
      .updateTodo({
        ...task,
        completed: !task.completed,
      })
      .subscribe(() => this.getTodoData());
  }

  addTask(): void {
    this.todoService
      .addTodo({
        title: this.title,
        task_list: this.todoList.id,
        priority: this.todoData.length + 1,
      })
      .subscribe(() => this.getTodoData());
    this.title = '';
  }

  removeTask(taskId: number): void {
    this.todoService.deleteTodo(taskId).subscribe(() => this.getTodoData());
  }
}
