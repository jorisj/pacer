import { Component } from '@angular/core';
import { KmphToPaceComponent } from "./kmph-to-pace/kmph-to-pace.component";

@Component({
  selector: 'app-root',
  imports: [KmphToPaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pacer';
}
