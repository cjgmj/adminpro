import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Usuario } from '../../models/usuario.model';
import swal from 'sweetalert';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor( private _usuarioService: UsuarioService, private _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe( () => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe( (resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( texto: string ) {
    if ( texto !== '') {
      this.cargando = true;
      this._usuarioService.buscarUsuarios(texto).subscribe( (usuarios: Usuario[] ) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
    } else {
      this.cargarUsuarios();
    }
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this._usuarioService.usuario._id ) {
      swal('No puede borrar usuario', 'No se puede borrar a sí mismo', 'error');
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: `Va a borrar el usuario ${usuario.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then( borrar => {
      if (borrar) {
        this._usuarioService.borrarUsuario(usuario._id).subscribe(() => {
          this.cargarUsuarios();
        });
      }
    });
  }

  guardarUsuario( usuario: Usuario ) {
    this._usuarioService.actualizarUsuario( usuario ).subscribe();
  }

  obtenerDatos( usuario: Usuario ) {
    this._modalUploadService.obtenerDatos('usuarios', usuario._id, usuario.nombre, usuario.img);
  }

}
