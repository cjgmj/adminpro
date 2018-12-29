import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor( private activateRoute: ActivatedRoute, private http: HttpClient ) {
    activateRoute.params.subscribe( params => {
      this.buscar(params['texto']);
    });
  }

  ngOnInit() {
  }

  buscar( texto: string ) {
    const url = `${URL_SERVICIOS}/busqueda/todo/${texto}`;

    this.http.get( url ).subscribe( (resp: any) => {
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;
      this.usuarios = resp.usuarios;
    });
  }

}
