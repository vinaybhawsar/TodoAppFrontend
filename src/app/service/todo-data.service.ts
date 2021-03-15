import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Todo } from '../model/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private taskUrl = 'http://localhost:8000/api/v1/task'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  /** GET getTodo from the server */
  getTodo(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.taskUrl}/`).pipe(
      tap((response: any) => response.results),
      catchError(this.handleError<Todo[]>('getTodo', []))
    );
  }

  /** GET Todo by id. Return `undefined` when id not found */
  getTodoNo404<Data>(id: number): Observable<Todo> {
    const url = `${this.taskUrl}/?id=${id}`;
    return this.http.get<Todo[]>(url).pipe(
      map((todo) => todo[0]), // returns a {0|1} element array
      catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  /** GET Todo by id. Will 404 if id not found */
  getTodoById(id: number): Observable<Todo> {
    const url = `${this.taskUrl}/${id}/`;
    return this.http
      .get<Todo>(url)
      .pipe(catchError(this.handleError<Todo>(`getTodoById=${id}`)));
  }

  /* GET Todo whose name contains search term */
  searchTodo(term: string): Observable<Todo[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http
      .get<Todo[]>(`${this.taskUrl}/?name=${term}`)
      .pipe(catchError(this.handleError<Todo[]>('searchTodo', [])));
  }

  //////// Save methods //////////

  /** POST: add a new Todo List to the server */
  addTodo(todo: Todo): Observable<Todo> {
    return this.http
      .post<Todo>(`${this.taskUrl}/`, todo, this.httpOptions)
      .pipe(catchError(this.handleError<Todo>('addTodo')));
  }

  /** DELETE: delete the Todo List from the server */
  deleteTodo(todo: Todo | number): Observable<Todo> {
    const id = typeof todo === 'number' ? todo : todo.id;
    const url = `${this.taskUrl}/${id}/`;

    return this.http
      .delete<Todo>(url, this.httpOptions)
      .pipe(catchError(this.handleError<Todo>('deleteTodo')));
  }

  /** PUT: update the Todo List on the server */
  updateTodo(todo: Todo): Observable<any> {
    const url = `${this.taskUrl}/${todo.id}/`;
    return this.http
      .put(url, todo, this.httpOptions)
      .pipe(catchError(this.handleError<any>('updateTodo')));
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
