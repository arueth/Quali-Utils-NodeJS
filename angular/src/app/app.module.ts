import {AmChartsModule} from "@amcharts/amcharts3-angular";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {FooterComponent} from "./footer/footer.component";
import {IndexComponent} from "./index/index.component";
import {NavComponent} from "./nav/nav.component";
import {ResourceReservationGanttComponent} from './resource-reservation-gantt/resource-reservation-gantt.component';


const appRoutes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'resource-reservation-gantt', component: ResourceReservationGanttComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    IndexComponent,
    NavComponent,
    ResourceReservationGanttComponent
  ],
  imports: [
    AmChartsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
