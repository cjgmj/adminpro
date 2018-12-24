import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuardGuard implements CanActivate {
constructor( private _usuarioService: UsuarioService, private router: Router ) { }

  canActivate(): boolean {
    if ( !this._usuarioService.estaLogueado() ) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
