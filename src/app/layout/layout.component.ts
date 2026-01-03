import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ToastComponent } from "../shared/components/toast/toast.component";


@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
    templateUrl: './layout.component.html',
    styles: [`
        :host { display: block; }
        .active-link { @apply bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600; }   
    `]
})
export class LayouComponent {
    private router = inject(Router);
    isSidebarOpen = true;

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login'])
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}