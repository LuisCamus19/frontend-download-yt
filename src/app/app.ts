import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Converter } from './components/converter/converter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Converter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FrontDownloadMusicMp3');
}
