import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { EmpleadoService } from '../empleado.service';
import { Empleado } from '../../../models/empleado.model';
import { EmpleadoFormComponent } from '../empleado-form/empleado-form.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ToastService } from '../../../shared/components/toast.service';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [CommonModule, EmpleadoFormComponent],
  templateUrl: './empleado-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoListComponent implements OnInit {
  
  private readonly empleadoService = inject(EmpleadoService);
  private readonly toast = inject(ToastService);

  empleados = signal<Empleado[]>([]);
  isLoading = signal<boolean>(true);
  showModal = signal(false);
  empleadoSeleccionado = signal<Empleado | null>(null);
  showDeleteModal = signal(false);
  idParaEliminar = signal<number | null>(null);

  totalEmpleados = computed(() => this.empleados().length);
  
  totalNomina = computed(() => {
    return this.empleados().reduce((acc, emp) => acc + (emp.salario || 0), 0);
  });

  promedioSalario = computed(() => {
    const total = this.totalEmpleados();
    return total > 0 ? this.totalNomina() / total : 0;
  })

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    // Escuchamos el buscador con debounce
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.loadEmpleados(term);
    });

    // Carga inicial sin filtros
    this.loadEmpleados();
  }

  // Ahora acepta el parámetro de búsqueda
  loadEmpleados(term: string = ''): void {
    this.isLoading.set(true); // Mostrar pulse al buscar
    this.empleadoService.getEmpleados(term).subscribe({
      next: (response) => {
        this.empleados.set(response.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  toggleModal() {
    if (this.showModal()) {
      this.empleadoSeleccionado.set(null);
    }
    this.showModal.update(v => !v);
  }

  confirmarEliminacion(id: number) {
    this.idParaEliminar.set(id);
    this.showDeleteModal.set(true);
  }
  
  ejecutarBaja() {
    const id = this.idParaEliminar();
    if (id) {
      this.empleadoService.deleteEmpleado(id).subscribe({
        next: () => {
          this.loadEmpleados();
          this.cerrarModalEliminar();
          this.toast.mostrar('Empleado eliminado con éxito', 'success');
        }
      })
    } 
  }

  cerrarModalEliminar() {
    this.showDeleteModal.set(false);
    this.idParaEliminar.set(null);
  }

  onSearch(event: Event) {
    const element = event.target as HTMLInputElement;
    this.searchSubject.next(element.value);
  }

  abrirEdicion(emp: Empleado) {
    this.empleadoSeleccionado.set(emp);
    this.showModal.set(true);
  }
}
