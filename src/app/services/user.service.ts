import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { endponts } from '../config/endpoints';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getPatients(): Observable<Patient> {
    return this.http.get<Patient>(
      `${environment.API_URL}/${endponts.getPatients}`
    );
  }

  addPatient(payload: Patient): Observable<Patient> {
    return this.http.post<Patient>(
      `${environment.API_URL}/${endponts.addPatients}`,
      payload
    );
  }
}
