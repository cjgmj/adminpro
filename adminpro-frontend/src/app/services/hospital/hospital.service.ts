import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class HospitalService {

  totalHospitales = 0;

  constructor( private http: HttpClient, private _usuarioService: UsuarioService ) { }

  cargarHospitales( desde: number = 0 ) {
    const url = `${URL_SERVICIOS}/hospital?desde=${desde}`;

    return this.http.get( url ).pipe(map( (resp: any) => {
      this.totalHospitales = resp.total;
      return resp.hospitales;
    }));
  }

  obtenerHospital( id: string ) {
    const url = `${URL_SERVICIOS}/hospital/${id}`;

    return this.http.get( url ).pipe(map( (resp: any) => resp.hospital));
  }

  borrarHospital( id: string) {
    const url = `${URL_SERVICIOS}/hospital/${id}?token=${this._usuarioService.token}`;

    return this.http.delete( url ).pipe(map( () => swal('Hospital borrado', 'Eliminado correctamente', 'success')));
  }

  crearHospital( nombre: string ) {
    const url = `${URL_SERVICIOS}/hospital?token=${this._usuarioService.token}`;

    return this.http.post( url, { nombre } ).pipe(map( (resp: any) => resp.hospital));
  }

  buscarHospital( texto: string ) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/hospitales/${texto}`;

    return this.http.get( url ).pipe(map( (resp: any) => resp.hospitales ));
  }

  actualizarHospital( hospital: Hospital ) {
    const url = `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this._usuarioService.token}`;

    return this.http.put( url, hospital ).pipe(map( () => {
      swal('Hospital actualizado', hospital.nombre, 'success');
      return true;
    }));
  }
}
