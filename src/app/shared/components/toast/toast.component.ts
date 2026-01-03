import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.currentToast(); as toast) {
      <div class="fixed top-5 right-5 z-[200] animate-fade-in-left">
        <div [ngClass]="{
          'bg-green-600': toast.tipo === 'success',
          'bg-red-600': toast.tipo === 'error',
          'bg-blue-600': toast.tipo === 'info'
        }" class="flex items-center gap-3 text-white px-6 py-4 rounded-2xl shadow-2xl min-w-[300px]">
          
          @if (toast.tipo === 'success') {
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          } @else {
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          }

          <span class="font-medium">{{ toast.mensaje }}</span>
          
          <button (click)="toastService.currentToast.set(null)" class="ml-auto hover:scale-110 transition-transform">
            ✕
          </button>
        </div>
      </div>
    }
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}