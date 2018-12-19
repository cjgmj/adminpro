import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit {

  constructor() {
    const obs = new Observable( observer => {
      let contador = 0;
      const intervalo = setInterval( () => {

        contador++;

        observer.next( contador );

        if ( contador === 3 ) {
          clearInterval(intervalo);
          observer.complete();
        }

        if ( contador === 2 ) {
          // clearInterval(intervalo);
          observer.error('El observador falló en la ejecución.');
        }

      }, 1000 );
    } );

    obs.pipe( retry(2) )
    .subscribe(
      numero => console.log('Subs', numero),
      error => console.error('Error en el observer.', error),
      () => console.log( 'El observer terminó.')
     );
  }

  ngOnInit() {
  }

}
