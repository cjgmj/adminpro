import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File = null;
  imagenTemp: any = null;

  constructor( private _subirArchivoService: SubirArchivoService, public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
  }

  seleccionImage( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') === -1) {
      this.imagenSubir = null;
      swal('Solo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  borrarDatos() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this._modalUploadService.borrarDatos();
  }

  subirImagen() {
    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id ). then( resp => {
      this._modalUploadService.notificacion.emit( resp );
      this.borrarDatos();
    });
  }

}
