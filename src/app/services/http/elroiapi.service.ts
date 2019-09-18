import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmailHTMLContent } from 'src/app/model/mail';
import { Authenticate } from 'src/app/model/authentication';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})


export class ElroiapiService {
  private url = environment.serviceUrl;
  jwtToken: string;
  private authurl = environment.authUrl;
  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';
  constructor(private http: HttpClient) { }

  EmailByType(_EmailTestHTMLContent: EmailHTMLContent) {
    const body = JSON.stringify(_EmailTestHTMLContent);
    return this.http.post<any[]>(this.url + 'SendEmailHtml', body, httpOptions);
  }

  uploadFileToServer(frmdata: FormData) {
    const _headers = new HttpHeaders();
    _headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(this.url + 'uploadFileToServer', frmdata, { headers: _headers });
  }

  getElements() {
    const httpBearerHeader1 = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem(this.envKey.toString() + 'jwtloginToken')
      })
    };
    return this.http.get<Authenticate>(this.authurl + '/elements/getelements', httpBearerHeader1);
  }

}
