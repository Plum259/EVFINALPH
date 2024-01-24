import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Publicacion } from '../home/home.page';
import { addIcons } from 'ionicons';
import { cameraOutline} from 'ionicons/icons'
import {Camera, Photo, CameraResultType} from '@capacitor/camera'
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../Servicios/publicaciones.service';

@Component({
  selector: 'app-publicacion-form',
  standalone: true,
  templateUrl: './publicacion-form.component.html',
  styleUrls: ['./publicacion-form.component.scss'],
  imports: [IonicModule,ReactiveFormsModule,CommonModule]
})
export class PublicacionFormComponent  implements OnInit {
  publicacionForm: FormGroup;
  listaPublicaciones: Publicacion[] = [];
  fotografia:Photo|null = null
  constructor(private publicacionService:PublicacionesService) 
  {
    this.publicacionForm = new FormGroup({
      Titulo: new FormControl('', [Validators.required, Validators.minLength(5)]),
      Descripcion: new FormControl('',[Validators.required, Validators.minLength(20)])
    });
    addIcons({
      cameraOutline
    })
   }

  ngOnInit() {}
  async tomarFoto(){
    this.fotografia = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      saveToGallery:true,
      correctOrientation:true
    })
    return this.fotografia
  }
  async onSubmit(){
    if (this.publicacionForm.valid) {
      const nuevaPublicacion: Publicacion = {
        titulo: this.publicacionForm.get('Titulo')?.value,
        descripcion: this.publicacionForm.get('Descripcion')?.value,
        fecha: new Date().toISOString(),
        foto: this.fotografia?.base64String || ''
      }
      await this.publicacionService.agregarPublicacion(nuevaPublicacion)
      await this.publicacionService.getPublicaciones()
    }
  }
}
