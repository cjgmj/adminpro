import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor( private _usuarioService: UsuarioService, private router: Router ) { }

  canActivate(): boolean {

    if ( this._usuarioService.usuario.role !== 'ADMIN_ROLE' ) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
