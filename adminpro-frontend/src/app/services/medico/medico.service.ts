import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService {

  totalMedicos = 0;

  constructor( private http: HttpClient, private _usuarioService: UsuarioService ) { }

  cargarMedicos() {
    const url = `${URL_SERVICIOS}/medico`;

    return this.http.get( url ).pipe(map( (resp: any) => {
      this.totalMedicos = resp.total;
      return resp.medicos;
    }));
  }

  obtenerMedico( id: string ) {
    const url = `${URL_SERVICIOS}/medico/${id}`;

    return this.http.get( url ).pipe(map( (resp: any) => resp.medico));
  }

  borrarMedico( id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}?token=${this._usuarioService.token}`;

    return this.http.delete( url ).pipe(map( () => swal('Médico borrado', 'Eliminado correctamente', 'success')));
  }

  buscarMedicos( texto: string ) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${texto}`;

    return this.http.get( url ).pipe(map( (resp: any) => resp.medicos ));
  }

  guardarMedico( medico: Medico ) {
    let url: string;
    if ( !medico._id ) {
      url = `${URL_SERVICIOS}/medico?token=${this._usuarioService.token}`;
      return this.http.post( url, medico ).pipe(map( (resp: any) => {
        swal('Medico creado', medico.nombre, 'success');
        return resp.medico;
      }));
    }

    url = `${URL_SERVICIOS}/medico/${medico._id}?token=${this._usuarioService.token}`;
    return this.http.put( url, medico ).pipe(map( (resp: any) => {
      swal('Medico actualizado', medico.nombre, 'success');
      return resp.medico;
    }));
  }
}
