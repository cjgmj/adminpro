import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame = false;
  email: string;

  constructor( private router: Router, private _usuarioService: UsuarioService ) { }

  ngOnInit() {
    init_plugins();
    this.email = localStorage.getItem('email') || '';
    if ( this.email !== '' ) {
      this.recuerdame = true;
    }
  }

  ingresar( form: NgForm ) {
    if ( form.invalid ) {
      return;
    }

    const usuario = new Usuario(null, form.value.email, form.value.password);
    this._usuarioService.login( usuario, form.value.recuerdame ).subscribe(resp => this.router.navigate( ['/dashboard'] ));
  }
}
