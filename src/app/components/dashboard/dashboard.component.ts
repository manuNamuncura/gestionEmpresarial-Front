import { Component } from '@angular/core';
import { EmpleadoListComponent } from '../empleado-list/empleado-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [EmpleadoListComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

}
