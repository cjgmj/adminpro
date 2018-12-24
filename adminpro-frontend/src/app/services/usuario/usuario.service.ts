import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( private http: HttpClient, private router: Router ) {
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
}
