import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DownloadRequest } from '../models/DownloadRequest';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Downloadservice {
  private http = inject(HttpClient);

  downloadMp3(req: DownloadRequest): Observable<HttpEvent<Blob>> {
    const url = `${environment.apiUrl}/downloads/mp3`;

    return this.http.post(url, req, {
      observe: 'events', // Permite capturar eventos parciales de progreso
      reportProgress: true, // Habilita el reporte de progreso de descarga por hardware
      responseType: 'blob', // Recibe el archivo final empaquetado
    });
  }

  downloadVideo(req: DownloadRequest): Observable<HttpEvent<Blob>> {
    const url = `${environment.apiUrl}/downloads/video`;

    return this.http.post(url, req, {
      observe: 'events',
      reportProgress: true,
      responseType: 'blob',
    });
  }
}
