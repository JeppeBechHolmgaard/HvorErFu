import { Component, OnInit } from '@angular/core';
import {AuthService } from './services/auth.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public auth: AuthService){


  }
  

  markers:any[] =[];
  zoom = 12;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  };
  img_url = "../assets/182-1829287_cammy-lin-ux-designer-circle-picture-profile-girl.png";

  icon = {
    url:this.img_url + '#custom_marker',
    scaledSize: new google.maps.Size(40, 40),
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
    };
    
  positionObj = {lat: 57.0123113,
    lng: 9.9883962};
  
    ngOnInit() :void{
    if(navigator.geolocation){
      
      this.watchPosition()
      this.markers.push({
        position: this.positionObj,
        title: 'Her står du nu',
        options: { animation: google.maps.Animation.BOUNCE,
        icon:this.icon}
  });
    }
    else{console.log('location is not supported!!');}

      
  
  }

      

      
    
  
watchPosition(){
  navigator.geolocation.watchPosition((position)=>{
    console.log('lat: '+position.coords.latitude+', lon: '+position.coords.longitude);
    this.positionObj={
      lat: Number(position.coords.latitude),
      lng: Number(position.coords.longitude),
    };

    this.center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    
    console.log(this.markers[0].position);
    this.markers[0].position=this.positionObj;
    console.log(this.markers[0].position);

  }),(err:any)=>{
    console.log(err);
    
  }
} 
 
  zoomIn() {
    if (this.zoom < this.options.maxZoom!) this.zoom++;
  }
 
  zoomOut() {
    if (this.zoom > this.options.minZoom!) this.zoom--;
  }
   }
