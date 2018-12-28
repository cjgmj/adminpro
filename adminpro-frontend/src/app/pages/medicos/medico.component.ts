import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MedicoService, HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', null, '', '');
  hospital: Hospital = new Hospital('');

  constructor( private _medicoService: MedicoService, private _hospitalService: HospitalService, private router: Router,
    private activatedRoute: ActivatedRoute, private _modalUploadService: ModalUploadService ) {
      activatedRoute.params.subscribe( params => {
        const id = params['id'];
        if ( id !== 'nuevo' ) {
          this.obtenerMedico(id);
        }
      });
    }

  ngOnInit() {
    this._hospitalService.cargarHospitales().subscribe( hospital => this.hospitales = hospital );
    this._modalUploadService.notificacion.subscribe( (resp: any) => this.medico.img = resp.medico.img );
  }

  guardarMedico( form: NgForm ) {
    if ( form.invalid ) {
      return;
    }

    this._medicoService.guardarMedico( this.medico ).subscribe((medico) => {
      this.medico._id = medico._id;
      this.router.navigate(['/medico', medico._id]);
    });
  }

  cambiarHospital( id: string ) {
    this._hospitalService.obtenerHospital( id ).subscribe(hospital => this.hospital = hospital);
  }

  obtenerMedico( id: string ) {
    this._medicoService.obtenerMedico(id).subscribe(medico => {
      this.medico = medico;
      this.medico.hospital = medico.hospital._id;
      this.cambiarHospital( this.medico.hospital );
    });
  }

  obtenerDatos( medico: Medico ) {
    this._modalUploadService.obtenerDatos('medicos', medico._id, medico.nombre, medico.img, 'medico');
  }
}
