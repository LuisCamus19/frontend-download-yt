import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DownloadRequest } from '../models/DownloadRequest';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Downloadservice {
  // En Angular moderno usamos 'inject' en lugar del constructor
  private http = inject(HttpClient);

  downloadMp3(req: DownloadRequest): Observable<HttpResponse<Blob>> {
    const url = `${environment.apiUrl}/downloads/mp3`;

    return this.http.post(url, req, {
      observe: 'response', // Para leer los headers (X-Filename)
      responseType: 'blob', // Para recibir el archivo binario
    });
  }

  downloadVideo(req: DownloadRequest): Observable<HttpResponse<Blob>> {
    const url = `${environment.apiUrl}/downloads/video`;

    return this.http.post(url, req, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
