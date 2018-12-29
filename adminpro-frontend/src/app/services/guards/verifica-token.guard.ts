import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor( private _usuarioService: UsuarioService, private router: Router ) { }

  canActivate(): Promise<boolean> | boolean {
    const token = this._usuarioService.token;
    const payload = JSON.parse( atob(token.split('.')[1]) );
    const exp = this.expirado(payload.exp);

    if ( exp ) {
      return false;
    }

    return this.renueva(payload.exp);
  }

  expirado( fechaExp: number ): boolean {
    const now = new Date().getTime() / 1000;

    if ( fechaExp < now ) {
      return true;
    }

    return false;
  }

  renueva( fechaExp: number ): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      const tokenExp = new Date(fechaExp * 1000);
      const now = new Date();

      now.setTime(now.getTime() + (1 * 60 * 60 * 1000));

      if ( tokenExp.getTime() > now.getTime() ) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken().subscribe( () => {
          resolve(true);
        }, () => {
          this.router.navigate(['/login']);
          reject(false);
        });
      }
    });
  }
}
