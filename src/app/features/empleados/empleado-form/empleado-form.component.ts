import { Component, inject, output, signal, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from '../empleado.service';
import { Empleado } from '../../../models/empleado.model';
import { ToastService } from '../../../shared/components/toast.service';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empleado-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly empleadoService = inject(EmpleadoService);
  private readonly toast = inject(ToastService);

  // Evento para avisar al padre que debe refrescar la lista
  empleadoCreado = output<void>();
  closeModal = output<void>();
  
  empleadoAEditar = input<Empleado | null>(null);
  isSubmitting = signal(false);

  constructor() {
    effect(() => {
      const emp = this.empleadoAEditar();
      if (emp) {
        this.empleadoForm.patchValue({
          nombre: emp.nombre,
          email: emp.email,
          telefono: emp.telefono,
          salario: emp.salario as any,
          departamentoId: emp.departamento?.id as any,
          fechaIngreso: emp.fechaIngreso
        })
      }
    })
  }

  // Formulario con validaciones WCAG y tipado
  empleadoForm = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]], // Ahora es obligatorio
    salario: [null, [Validators.required]],
    departamentoId: [null, [Validators.required]],
    fechaIngreso: [new Date().toISOString().split('T')[0], [Validators.required]], // Fecha actual por defecto
  });

  onSubmit(): void {
  if (this.empleadoForm.invalid) return;
  this.isSubmitting.set(true);

  const val = this.empleadoForm.getRawValue();
  
  // Construimos el payload exacto que espera el Backend
  const payload = { 
    ...val, 
    departamento: { id: val.departamentoId } 
  };

  const id = this.empleadoAEditar()?.id;

  // Lógica de decisión: ¿Actualizar o Crear?
  const request = id
    ? this.empleadoService.updateEmpleado(id, payload as any)
    : this.empleadoService.saveEmpleado(payload as any);
  
  request.subscribe({
    next: () => {
      this.empleadoCreado.emit();
      this.isSubmitting.set(false);
      this.closeModal.emit();
    },
    error: (err) => {
      console.error('Error en la operación:', err);
      this.isSubmitting.set(false);
    }
  });

  this.empleadoService.saveEmpleado(payload as any).subscribe({
    next: () => {
      this.toast.mostrar('Empleado guardado con exito', 'success');
      this.empleadoCreado.emit();
      this.closeModal.emit();
    },
    error: () => this.toast.mostrar('Error al procesar la solicitud', 'error')
  });
}
}
