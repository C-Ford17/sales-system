import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ← IMPORTANTE
  imports: [RouterOutlet],
  templateUrl: './app.html', // o app.component.html
  styleUrl: './app.css' // o app.component.css
})
export class App {
  title = 'sales-system-web';
}
