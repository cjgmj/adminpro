import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    const promesa = new Promise( (resolve, reject) => {
      let contador = 0;
      const intervalo = setInterval( () => {
        contador++;

        if (contador === 3) {
          resolve();
          // resolve('Ok.');
          // reject('Ha ocurrido un error en la ejecución.');
          clearInterval(intervalo);
        }
      }, 1000 );
    } );

    promesa.then( () => console.log('Terminó.') )
    // promesa.then( mensaje => console.log('Terminó.', mensaje) )
    .catch( error => console.error('Error en la promesa.', error) );
  }

  ngOnInit() {
  }

}
