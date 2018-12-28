import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ModalUploadService {

  public tipo: string;
  public id: string;
  public nombre: string;
  public imagen: string;
  public coleccion: string;

  public notificacion = new EventEmitter<any>();

  constructor() { }

  obtenerDatos( tipo: string, id: string, nombre: string, imagen: string, coleccion: string = 'usuario' ) {
    this.tipo = tipo;
    this.id = id;
    this.nombre = nombre;
    this.imagen = imagen;
    this.coleccion = coleccion;
  }

  borrarDatos() {
    this.tipo = null;
    this.id = null;
  }
}
