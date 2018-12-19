import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    this.subscription = this.getObservable().subscribe(
      numero => console.log('Subs', numero),
      error => console.error('Error en el observer.', error),
      () => console.log( 'El observer terminó.')
     );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getObservable(): Observable<any> {
    return new Observable( observer => {
      let contador = 0;
      setInterval( () => {

        contador++;

        const salida = {
          valor: contador
        };

        observer.next( salida );
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
