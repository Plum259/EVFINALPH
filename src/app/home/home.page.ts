import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PublicacionesService } from '../Servicios/publicaciones.service';
import { ModalController } from '@ionic/angular/standalone';
import { EliminarModelComponent } from '../eliminar-model/eliminar-model.component';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

export interface Publicacion
{
  id?:number
  titulo:string
  descripcion:string
  fecha:string
  foto?:string
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule,RouterModule,CommonModule],
  providers: [DatePipe]
})
export class HomePage {
  listaPublicaciones:Publicacion[] = []
  constructor(private modalController:ModalController,private publicacionService:PublicacionesService,private datePipe: DatePipe) {}

  async ngOnInit(){
    await this.publicacionService.iniciarPlugin()
    await this._obtenerPublicaciones()
  }
  async _obtenerPublicaciones(){
    this.listaPublicaciones = await this.publicacionService.getPublicaciones()
  }
  async borrarPublicacion(publicacion:any){
    const modal = await this.modalController.create({
      component:EliminarModelComponent,
      componentProps: {publicacion:publicacion}
    });
    await modal.present()
  }
  formatearFecha(fecha:string):string{
    const fechaFormateada = this.datePipe.transform(fecha, 'yyyy-MM-dd')
    return fechaFormateada || '';
  }
}
