import { Component, inject, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EmpleadoService } from './empleado.service';


@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empleado-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpleadoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly empleadoService = inject(EmpleadoService);

  // Evento para avisar al padre que debe refrescar la lista
  empleadoCreado = output<void>();
  closeModal = output<void>();

  isSubmitting = signal(false);

  // Formulario con validaciones WCAG y tipado
  empleadoForm = this.fb.group({
  nombre: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  telefono: ['', [Validators.required]], // Ahora es obligatorio
  salario: [null, [Validators.required]],
  departamentoId: [null, [Validators.required]],
  fechaIngreso: [new Date().toISOString().split('T')[0], [Validators.required]] // Fecha actual por defecto
});

  onSubmit(): void {
  if (this.empleadoForm.invalid) return;
  this.isSubmitting.set(true);
  
  const rawValue = this.empleadoForm.getRawValue();
  
  const empleadoParaGuardar = {
    nombre: rawValue.nombre,
    email: rawValue.email,
    telefono: rawValue.telefono,
    salario: rawValue.salario,
    fechaIngreso: rawValue.fechaIngreso, // Enviamos la fecha
    departamento: { id: rawValue.departamentoId }
  };

  this.empleadoService.saveEmpleado(empleadoParaGuardar as any).subscribe({
    next: () => {
      this.empleadoCreado.emit();
      this.isSubmitting.set(false);
      this.closeModal.emit();
    },
    error: (err) => {
      console.error('Error de validación en Backend:', err);
      this.isSubmitting.set(false);
    }
  });
}
}