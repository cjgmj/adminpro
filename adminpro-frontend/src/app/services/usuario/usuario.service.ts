import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class UsuarioService {

  constructor( private http: HttpClient ) { }

  crearUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario`;

    return this.http.post(url, usuario).pipe(map( (resp: any) => {
      swal('Usuario creado', usuario.nombre, 'success');
      return resp.usuario;
    }));
  }
}
