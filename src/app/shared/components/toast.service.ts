import { Injectable, signal } from '@angular/core';

export interface Toast {
  mensaje: string;
  tipo: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Signal que contiene la alerta actual o null
  currentToast = signal<Toast | null>(null);

  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' = 'success') {
    this.currentToast.set({ mensaje, tipo });
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      this.currentToast.set(null);
    }, 3000);
  }
}