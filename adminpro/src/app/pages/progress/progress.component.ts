import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  progreso = 50;

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
  }

}
