import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EmpleadoService } from './empleado.service';
import { Empleado } from '../../models/empleado.model';
import { EmpleadoFormComponent } from './empleado-form.component';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [CommonModule, EmpleadoFormComponent],
  templateUrl: './empleado-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoListComponent implements OnInit {
  
  private readonly empleadoService = inject(EmpleadoService);

  empleados = signal<Empleado[]>([]);
  isLoading = signal<boolean>(true);
  showModal = signal(false);

  toggleModal() {
    this.showModal.update(v => !v);
  }

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
  
  eliminarEmpleado(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleadoService.deleteEmpleado(id).subscribe({
        next: () => {
          this.loadEmpleados();
        }
      })
    }
  }
    
}
