import {Component} from '@angular/core';

import {QualiUtilsService} from "./services/quali-utils.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Quali Utils';

  constructor(private qualiUtilsService: QualiUtilsService) {
  }
}
