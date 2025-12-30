import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Empleado } from "../../models/empleado.model";

@Injectable({
    providedIn: 'root'
})
export class EmpleadoService {
    
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/api/empleados';

    getEmpleados(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    saveEmpleado(empleado: Partial<Empleado>): Observable<Empleado> {
        return this.http.post<Empleado>(this.apiUrl, empleado);
    }
}