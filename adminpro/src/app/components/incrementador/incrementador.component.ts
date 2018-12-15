import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @Input(`titulo`) leyenda = 'Leyenda';
  @Input() progreso = 50;

  @Output(`actualizar`) cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  cambiarValor( valor: number) {
    this.progreso += valor;

    if (this.progreso <= 0) {
      this.progreso = 0;
    }

    if (this.progreso >= 100) {
      this.progreso = 100;
    }

    this.cambioValor.emit(this.progreso);
  }

  onChanges( event: number ) {

    const elemHTML = document.getElementsByName('progreso')[0];

    if (event <= 0) {
      this.progreso = 0;
    } else if (event >= 100) {
      this.progreso = 100;
    } else {
      this.progreso = event;
    }

    elemHTML['value'] = Number( this.progreso );

    this.cambioValor.emit(this.progreso);
  }

}
