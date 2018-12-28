import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor( private _hospitalService: HospitalService, private _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe( () => this.cargarHospitales() );
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde).subscribe( hospitales => {
      this.totalRegistros = this._hospitalService.totalHospitales;
      this.hospitales = hospitales;
      this.cargando = false;
    });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  buscarHospital( texto: string ) {
    if ( texto !== '') {
      this.cargando = true;
      this._hospitalService.buscarHospital(texto).subscribe( (hospitales: Hospital[] ) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
    } else {
      this.cargarHospitales();
    }
  }

  guardarHospital( hospital: Hospital ) {
    this._hospitalService.actualizarHospital( hospital ).subscribe();
  }

  borrarHospital( hospital: Hospital ) {
    swal({
      title: '¿Está seguro?',
      text: `Va a borrar el hospital ${hospital.nombre}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then( borrar => {
      if (borrar) {
        this._hospitalService.borrarHospital(hospital._id).subscribe(() => {
          this.cargarHospitales();
        });
      }
    });
  }

  crearHospital() {
    swal({
      title: 'Crear hospital',
      text: 'Introduzca el nombre del hospital',
      content: { element: 'input' },
      icon: 'info',
      buttons: ['Cancelar', 'Aceptar'],
      dangerMode: true
    }).then(registro => {
      if ( !registro || registro.trim() === '' ) {
        return;
      }

      this._hospitalService.crearHospital( registro ).subscribe(() => this.cargarHospitales());
    });
  }

  obtenerDatos( hospital: Hospital ) {
    this._modalUploadService.obtenerDatos('hospitales', hospital._id, hospital.nombre, hospital.img, 'hospital');
  }

}
