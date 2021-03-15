import { Component, OnInit } from '@angular/core';
import { TodoList } from '../model/todo-list.model';
import { TodoListService } from '../service/todo-list.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  todoList: TodoList[] = [];
  name: string;

  constructor(private todoListService: TodoListService) {}

  ngOnInit() {
    this.getTodoList();
  }

  getTodoList(): void {
    this.todoListService.getTodoList().subscribe((todoList: any) => {
      this.todoList = todoList.results;
    });
  }

  addTaskList(): void {
    this.todoListService
      .addTodoList({
        name: this.name,
      })
      .subscribe(() => this.getTodoList());
    this.name = '';
  }

  removeTaskList(taskListId: number): void {
    this.todoListService
      .deleteTodoList(taskListId)
      .subscribe(() => this.getTodoList());
  }
}
