import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( private http: HttpClient, private router: Router, private _subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token !== null );
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token =  localStorage.getItem('token');
    } else {
      this.token = null;
    }
    if ( localStorage.getItem('usuario') ) {
      this.usuario =  JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = `${URL_SERVICIOS}/login/google`;

    // En ECMAS6 { token } es como poner { token: token }
    return this.http.post(url, { token } ).pipe(map( (resp: any) => {
      this.guardarStorage( resp.id, resp.token, resp.usuario);
      return true;
    }));
  }

  login( usuario: Usuario, recuerdame: boolean = false ) {

    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = `${URL_SERVICIOS}/login`;
    return this.http.post(url, usuario).pipe(map( (resp: any) => {
      this.guardarStorage(resp.id, resp.token, resp.usuario);
      return true;
    }));
  }

  crearUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario`;

    return this.http.post(url, usuario).pipe(map( (resp: any) => {
      swal('Usuario creado', usuario.nombre, 'success');
      return resp.usuario;
    }));
  }

  actualizarUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;

    return this.http.put(url, usuario).pipe(map( (resp: any) => {
      this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
      swal('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }));
  }

  cambiarImagen ( archivo: File, id: string ) {
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id ).then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      this.guardarStorage(id, this.token, this.usuario);
      swal('Imagen actualizado', this.usuario.nombre, 'success');
    }).catch( resp => {
      swal('Fallo al actualizar la imagen', this.usuario.nombre, 'error');
    });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = `${URL_SERVICIOS}/usuario?desde=${desde}`;

    return this.http.get( url );
  }

  buscarUsuarios( texto: string ) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${texto}`;

    return this.http.get( url ).pipe(map( (resp: any) => resp.usuarios ));
  }
}
