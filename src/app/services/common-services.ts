import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  pageTitle   = new Subject();
  isLoggedIn  = new Subject();

  constructor(private http: HttpClient) { }
  blackHeadder = '';
  baseUrl(){
    return environment.url;
  }
  sendEmail(email) {
   
    const url = 'https://us-central1-jobcostingwebapp.cloudfunctions.net/app?to='+email.to+'&subject=' + email.subject + '&mess=' + email.mess;

    return this.http.get(url);
  }



}
