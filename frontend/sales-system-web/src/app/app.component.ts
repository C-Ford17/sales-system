import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // ← Importar esto

@Component({
    selector: 'app-root',
    standalone: true, // ← Asegúrate de esto
    imports: [RouterOutlet], // ← Agregar al array imports
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'sales-system-web';
}
