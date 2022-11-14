import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Envuser } from '@app/_models/envuser.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject : BehaviorSubject<Envuser>;
  public currentUser : Observable<Envuser>;

  constructor(private http : HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Envuser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() : Envuser {
    return this.currentUserSubject.value;
  }

  login(xemail : string, xcontrasena : string){
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });
    let options = { headers : headers };
    let params = {
      xemail : xemail,
      xcontrasena : xcontrasena
    }
    return this.http.post(`${environment.apiUrl}/api/security/auth`, params, options).pipe(map((user : any) => {
      if(user.data.status == true){
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
      }
      else if(user.data.cusuario == 121){
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    location.reload();
  }
}
