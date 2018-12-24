import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import swal from 'sweetalert';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor( private _usuarioService: UsuarioService, private router: Router ) { }

  sonIguales( text: string, text2: string ) {
    return ( group: FormGroup ) => {
      const t1 = group.controls[text].value;
      const t2 = group.controls[text2].value;

      if ( t1 === t2 ) {
        return null;
      }

      return {
        sonIguales: true
      };
    };
  }

  ngOnInit() {
    init_plugins();

    this.form = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      email: new FormControl( null, [Validators.required, Validators.email] ),
      password: new FormControl( null, Validators.required ),
      password2: new FormControl( null, Validators.required ),
      condiciones: new FormControl( false )
    }, { validators: this.sonIguales( 'password', 'password2' ) });

    this.form.setValue({
      nombre: 'Test',
      email: 'test@test.com',
      password: '123456',
      password2: '123456',
      condiciones: true
    });
  }

  registrarUsuario() {
    if ( this.form.invalid ) {
      return;
    }

    if ( !this.form.value.condiciones ) {
      swal('Importante', 'Debe aceptar las condiciones', 'warning');
    }

    const usuario = new Usuario(
      this.form.value.nombre,
      this.form.value.email,
      this.form.value.password
    );

    this._usuarioService.crearUsuario( usuario ).subscribe( resp => this.router.navigate(['/login']));
  }

}
