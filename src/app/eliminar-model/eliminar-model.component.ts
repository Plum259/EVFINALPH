import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { PublicacionesService } from '../Servicios/publicaciones.service';
import { Publicacion } from '../home/home.page';

@Component({
  selector: 'app-eliminar-model',
  standalone: true,
  templateUrl: './eliminar-model.component.html',
  styleUrls: ['./eliminar-model.component.scss'],
  imports: [CommonModule,IonicModule]
})
export class EliminarModelComponent  implements OnInit {
  publicacion: any;
  constructor(private modalController:ModalController,private publicacionService:PublicacionesService) { }

  ngOnInit() {}

  cerrarModal(){
    this.modalController.dismiss();
  }

  eliminarPublicacion(publicacion:Publicacion):void{
    this.publicacionService.eliminarPublicacion(publicacion.id || 0);
    this.cerrarModal();
  }

}
