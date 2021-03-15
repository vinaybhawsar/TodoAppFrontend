import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { TodoList } from '../model/todo-list.model';

@Injectable({ providedIn: 'root' })
export class TodoListService {
  private taskListUrl = 'http://localhost:8000/api/v1/task-list'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  /** GET getTodoList from the server */
  getTodoList(): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(`${this.taskListUrl}/`).pipe(
      tap((response: any) => response.results),
      catchError(this.handleError<TodoList[]>('getTodoList', []))
    );
  }

  /** GET Todo List by id. Return `undefined` when id not found */
  getTodoListNo404<Data>(id: number): Observable<TodoList> {
    const url = `${this.taskListUrl}/?id=${id}`;
    return this.http.get<TodoList[]>(url).pipe(
      map((todoList) => todoList[0]), // returns a {0|1} element array
      catchError(this.handleError<TodoList>(`getTodoList id=${id}`))
    );
  }

  /** GET Todo List by id. Will 404 if id not found */
  getTodoListById(id: number): Observable<TodoList> {
    const url = `${this.taskListUrl}/${id}/`;
    return this.http
      .get<TodoList>(url)
      .pipe(catchError(this.handleError<TodoList>(`getTodoListById=${id}`)));
  }

  /* GET Todo Lists whose name contains search term */
  searchTodoList(term: string): Observable<TodoList[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http
      .get<TodoList[]>(`${this.taskListUrl}/?name=${term}`)
      .pipe(catchError(this.handleError<TodoList[]>('searchTodoList', [])));
  }

  //////// Save methods //////////

  /** POST: add a new Todo List to the server */
  addTodoList(todoList: TodoList): Observable<TodoList> {
    return this.http
      .post<TodoList>(`${this.taskListUrl}/`, todoList, this.httpOptions)
      .pipe(catchError(this.handleError<TodoList>('addTodoList')));
  }

  /** DELETE: delete the Todo List from the server */
  deleteTodoList(todoList: TodoList | number): Observable<TodoList> {
    const id = typeof todoList === 'number' ? todoList : todoList.id;
    const url = `${this.taskListUrl}/${id}/`;

    return this.http
      .delete<TodoList>(url, this.httpOptions)
      .pipe(catchError(this.handleError<TodoList>('deleteTodoList')));
  }

  /** PUT: update the Todo List on the server */
  updateTodoList(todoList: TodoList): Observable<any> {
    const url = `${this.taskListUrl}/${todoList.id}/`;
    return this.http
      .put(url, todoList, this.httpOptions)
      .pipe(catchError(this.handleError<any>('updateTodoList')));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
