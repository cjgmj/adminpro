import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { throwError } from 'rxjs';
import swal from 'sweetalert';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[];

  constructor( private http: HttpClient, private router: Router, private _subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
  }

  renuevaToken() {
    const url = `${URL_SERVICIOS}/login/refreshToken?token=${this.token}`;

    return this.http.get( url ).pipe(map( (resp: any) => {
      this.token = resp.token;
      localStorage.setItem('token', this.token);
      return true;
    }), catchError( err => {
      this.router.navigate(['/login']);
      swal('Error al renovar token', 'No fue posible renovar token', 'error');
      return throwError( err );
    }));
  }

  estaLogueado() {
    return ( this.token !== null );
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token =  localStorage.getItem('token');
      this.usuario =  JSON.parse(localStorage.getItem('usuario'));
      this.menu =  JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = null;
      this.usuario = null;
      this.menu = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = null;
    this.menu = null;

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = `${URL_SERVICIOS}/login/google`;

    // En ECMAS6 { token } es como poner { token: token }
    return this.http.post(url, { token } ).pipe(map( (resp: any) => {
      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
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
      this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }), catchError( err => {
      swal('Error en el login', err.error.mensaje, 'error');
      return throwError( err );
    }));
  }

  crearUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario`;

    return this.http.post(url, usuario).pipe(map( (resp: any) => {
      swal('Usuario creado', usuario.nombre, 'success');
      return resp.usuario;
    }), catchError( err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return throwError( err );
    }));
  }

  actualizarUsuario( usuario: Usuario ) {
    const url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;

    return this.http.put(url, usuario).pipe(map( (resp: any) => {
      if ( usuario._id === this.usuario._id ) {
        this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu);
      }
      swal('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }));
  }

  cambiarImagen ( archivo: File, id: string ) {
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id ).then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      this.guardarStorage(id, this.token, this.usuario, this.menu);
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

  borrarUsuario( id: string ) {
    const url = `${URL_SERVICIOS}/usuario/${id}?token=${this.token}`;

    return this.http.delete( url ).pipe(map( () => {
      swal('Usuario borrado', 'El usuario se ha borrado correctamente', 'success');
      return true;
    }));
  }
}
