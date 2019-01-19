import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ResultsService {

  private postHeaders = {headers: new HttpHeaders({'Content-Type':  'application/json'})};

  constructor(private http: HttpClient) { }

  setResult(payload: any) {
    const url = '/api/results/set';
    this.http.post(url, payload, this.postHeaders).subscribe();
  }

  deleteResult(token: string) {
    const url = '/api/results/delete';
    this.http.post(url, {token: token}, this.postHeaders).subscribe();
  }
}
