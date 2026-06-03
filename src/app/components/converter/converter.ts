import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // 📦 Nuevo módulo importado
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Downloadservice } from '../../services/downloadservice';
import { MatSelectModule } from '@angular/material/select';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-converter',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule, // 📦 Añadido a las importaciones
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  templateUrl: './converter.html',
  styleUrl: './converter.css',
})
export class Converter {
  private downloadService = inject(Downloadservice);
  private snackBar = inject(MatSnackBar);

  // --- SIGNALS ---
  urlVideo = signal('');
  formatoSeleccionado = signal<'mp3' | 'mp4'>('mp3');
  calidadSeleccionada = signal('128');
  isLoading = signal(false);
  progressPercent = signal(0); // 📈 Controla la barra de progreso reactiva
  statusMessage = signal('Procesando enlace...'); // 💬 Muestra qué está haciendo el backend

  // --- VALIDACIÓN DE COBERTURA TOTAL ---
  isUrlValida = computed(() => {
    const url = this.urlVideo().trim();
    if (!url) return false;

    const regExp =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/|live\/|embed\/|v\/|.+\?v=)?([^&=%\?{}$]+)/;
    return regExp.test(url);
  });

  // --- OPCIONES DINÁMICAS ---
  opcionesCalidad = computed(() => {
    if (this.formatoSeleccionado() === 'mp3') {
      return [
        { value: '64', label: 'Baja (64 kbps)' },
        { value: '128', label: 'Normal (128 kbps)' },
        { value: '320', label: 'Máxima (320 kbps)' },
      ];
    } else {
      return [
        { value: '360', label: 'Baja (360p)' },
        { value: '720', label: 'HD (720p)' },
        { value: '1080', label: 'Full HD (1080p)' },
      ];
    }
  });

  cambiarFormato(nuevoFormato: 'mp3' | 'mp4') {
    this.formatoSeleccionado.set(nuevoFormato);
    this.calidadSeleccionada.set(nuevoFormato === 'mp3' ? '128' : '720');
  }

  convertir() {
    if (!this.isUrlValida()) return;
    this.isLoading.set(true);
    this.progressPercent.set(0);
    this.statusMessage.set('Invocando yt-dlp y multiplexando en el servidor...');

    const payload = {
      url: this.urlVideo().trim(),
      quality: this.calidadSeleccionada(),
    };

    const request$ =
      this.formatoSeleccionado() === 'mp3'
        ? this.downloadService.downloadMp3(payload)
        : this.downloadService.downloadVideo(payload);

    request$.subscribe({
      next: (event: HttpEvent<Blob>) => {
        // Fase 1: Recibiendo paquetes de bytes (Descarga directa desde tu backend a la PC)
        if (event.type === HttpEventType.DownloadProgress) {
          this.statusMessage.set('Transfiriendo archivo binario a tu dispositivo...');
          if (event.total) {
            const currentProgress = Math.round((event.loaded / event.total) * 100);
            this.progressPercent.set(currentProgress);
          }
        }

        // Fase 2: Conclusión y guardado del archivo físico
        else if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<Blob>;
          const encodedFilename = response.headers.get('X-Filename');
          let filename = `archivo_${new Date().getTime()}.${this.formatoSeleccionado()}`;

          if (encodedFilename) {
            try {
              filename = decodeURIComponent(encodedFilename);
            } catch (e) {}
          }

          if (response.body) {
            this.downloadFile(response.body, filename);
            this.mostrarNotificacion('¡Descarga completada con éxito!', 'success');
            this.urlVideo.set('');
          }
          this.isLoading.set(false);
          this.progressPercent.set(0);
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.progressPercent.set(0);
        this.mostrarNotificacion('Error al procesar la conversión de YouTube.', 'error');
      },
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      panelClass: tipo === 'error' ? ['red-snackbar'] : ['green-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
