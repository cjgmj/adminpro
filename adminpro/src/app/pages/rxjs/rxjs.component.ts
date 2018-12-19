import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit {

  constructor() {
    this.getObservable().subscribe(
      numero => console.log('Subs', numero),
      error => console.error('Error en el observer.', error),
      () => console.log( 'El observer terminó.')
     );
  }

  ngOnInit() {
  }

  getObservable(): Observable<any> {
    return new Observable( observer => {
      let contador = 0;
      const intervalo = setInterval( () => {

        contador++;

        const salida = {
          valor: contador
        };

        observer.next( salida );

        if ( contador === 3 ) {
          clearInterval(intervalo);
          observer.complete();
        }
      }, 1000 );
    } ).pipe(
      map( response => response['valor'] ),
      filter( (valor, index) => {
        if ( valor % 2 !== 0 ) {
          return true;
        }
        return false;
      })
     );
  }

}
