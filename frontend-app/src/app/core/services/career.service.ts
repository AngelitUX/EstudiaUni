import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, shareReplay } from 'rxjs';

export interface CareerMatriculaData {
  totalMatricula: number;
  pctMujeres: number | null;
  edadPromedio: number | null;
  sedes: string[];
  comunas: string[];
  modalidades: string[];
  jornadas: string[];
  duracionSemestres: number | null;
  acreditada: boolean;
  fuente: string;
}

export interface Career {
  id: string;
  universidad: string;
  abreviatura: string;
  nombre: string;
  area: string;
  ubicacion: string;
  descripcion: string;
  /** Enriched, per-institution description built from real SIES/MINEDUC matrícula data — falls back to `descripcion` when there's no match. */
  descripcionDetallada?: string;
  intereses: string[];
  puntajes: {
    nem: number;
    ranking: number;
    lectora: number;
    matematica1: number;
    matematica2: number;
    electiva: number;
  };
  puntajeCorte2025: number;
  /** Real enrollment facts for this career at this institution. Null if no match was found in the source dataset. */
  matriculaData: CareerMatriculaData | null;
}

export interface CareerFilters {
  ubicacion?: string;
  universidad?: string;
  area?: string;
  intereses?: string[];
  query?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private http = inject(HttpClient);
  // Hosted on Cloudinary (not bundled with the app) so the ~2700-career dataset doesn't
  // bloat the deploy bundle and can be refreshed independently of a frontend release.
  private dataUrl = 'https://res.cloudinary.com/dqm3syhwr/raw/upload/data/universidades-carreras.json';

  // Fetched once per session and shared — this is a ~3MB reference dataset that doesn't
  // change per-user, so every component asking for it reuses the same in-flight/cached request.
  private careers$ = this.http.get<Career[]>(this.dataUrl).pipe(shareReplay(1));

  getCareers(): Observable<Career[]> {
    return this.careers$;
  }

  getAreas(): Observable<string[]> {
    return this.getCareers().pipe(
      map(careers => Array.from(new Set(careers.map(c => c.area))).sort())
    );
  }

  getUbicaciones(): Observable<string[]> {
    return this.getCareers().pipe(
      map(careers => Array.from(new Set(careers.map(c => c.ubicacion))).sort())
    );
  }

  getUniversidades(): Observable<string[]> {
    return this.getCareers().pipe(
      map(careers => Array.from(new Set(careers.map(c => c.universidad))).sort())
    );
  }

  private normalize(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  recommendCareers(filters: CareerFilters): Observable<Career[]> {
    return this.getCareers().pipe(
      map(careers => {
        return careers.filter(c => {
          let matches = true;
          
          if (filters.ubicacion && !this.normalize(c.ubicacion).includes(this.normalize(filters.ubicacion))) {
            matches = false;
          }

          if (filters.universidad && this.normalize(c.universidad) !== this.normalize(filters.universidad)) {
            matches = false;
          }
          
          if (filters.area && c.area !== filters.area) {
            matches = false;
          }
          
          if (filters.intereses && filters.intereses.length > 0) {
            const hasAllSelected = filters.intereses.every(interest => 
              c.intereses.some(cInterest => this.normalize(cInterest) === this.normalize(interest))
            );
            if (!hasAllSelected) matches = false;
          }

          if (filters.query) {
            const q = this.normalize(filters.query);
            const inName = this.normalize(c.nombre).includes(q);
            const inUni = this.normalize(c.universidad).includes(q);
            const inAbbr = this.normalize(c.abreviatura).includes(q);
            if (!inName && !inUni && !inAbbr) matches = false;
          }

          return matches;
        });
      })
    );
  }
}
