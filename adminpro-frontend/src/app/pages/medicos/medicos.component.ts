import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  totalRegistros = 0;
  cargando = true;

  constructor( private _medicoService: MedicoService ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos().subscribe( medicos => {
      this.totalRegistros = this._medicoService.totalMedicos;
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  buscarMedico( texto: string ) {
    if ( texto !== '') {
      this.cargando = true;
      this._medicoService.buscarMedicos(texto).subscribe( (medicos: Medico[] ) => {
        this.medicos = medicos;
        this.cargando = false;
      });
    } else {
      this.cargarMedicos();
    }
  }

  borrarMedico( medico: Medico ) {
    swal({
      title: '¿Está seguro?',
      text: `Va a borrar el médico ${medico.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then( borrar => {
      if (borrar) {
        this._medicoService.borrarMedico(medico._id).subscribe(() => {
          this.cargarMedicos();
        });
      }
    });

  }
}
