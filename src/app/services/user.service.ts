import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { httpOptions } from '../../app/utils/http.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  private userUrl = environment.FRONT_OFFICE_SERVICE + '/users/';

  public editDataDetails: any = '';
  private signInSource = new BehaviorSubject(this.editDataDetails);
  public signInSource$ = this.signInSource.asObservable();

  emitMsgSignIn(params: any) {
    this.signInSource.next(params);
  }

  signUp(payload: any): Observable<any> {
    const uri = 'signup';
    const body = JSON.stringify(payload);

    return this.http.post<any>(this.userUrl + uri, body, httpOptions);
  }

  signIn(payload: any): Observable<any> {
    const uri = 'signin';
    const body = JSON.stringify(payload);

    return this.http.post<any>(this.userUrl + uri, body, httpOptions);
  }

  signOut(payload: any): Observable<any> {
    const uri = 'signout';
    const body = JSON.stringify(payload);

    return this.http.post<any>(this.userUrl + uri, body, httpOptions);
  }

  deleteLocalStorage() {
    localStorage.clear();
  }

  changePassword(payload: any): Observable<any> {
    const uri = 'changePassword';
    const body = JSON.stringify(payload);

    return this.http.post<any>(this.userUrl + uri, body, httpOptions);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(operation, error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
