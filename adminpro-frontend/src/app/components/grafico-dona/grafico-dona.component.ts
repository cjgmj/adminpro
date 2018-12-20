import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  @Input() chartLabels: string[] = [];
  @Input() chartData: number[] = [];
  @Input() chartType = '';

  constructor() { }

  ngOnInit() {
  }

}
