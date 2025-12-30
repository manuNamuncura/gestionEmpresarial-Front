import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EmpleadoService } from './empleado.service';
import { map, Observable } from 'rxjs';
import { Empleado } from '../../models/empleado.model';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empleado-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './empleado-list.css',
})
export class EmpleadoListComponent implements OnInit {
  
  private readonly empleadoService = inject(EmpleadoService);

  empleados = signal<Empleado[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadEmpleados();
  }

  loadEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe({
      next: (response) => {
        this.empleados.set(response.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
  
    
}
