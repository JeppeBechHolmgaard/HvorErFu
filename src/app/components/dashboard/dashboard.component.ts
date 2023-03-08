import { Component, OnInit } from '@angular/core';
import { composition, forEach } from 'mathjs';
import { interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FireDBService } from '../../services/fire-db.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(public authService: AuthService,     public dataService: FireDBService,
    ) {
      this.dataService.makeUserSearchable();
      this.dataService.getGroups().then((res)=>{      
       console.log(res);
       
       this.userGroups=res;
      });

      this.dataService.getUsersFriendRequest().then((res)=>{
        console.log(res);
        this.friendRequest=res
      })
    
  }
  markers:any={};
  zoom = 12;
  searchResults:any;
  selectedGroup:string='';
  userGroups:any=[];
  friendRequest:any=[];
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
    
  };
  
  icon = {
    url:this.authService.userData.photoURL + '#custom_marker',
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

      
realTimeUpdate(){
  this.dataService.get('chats',this.selectedGroup).then((res:any)=>{
    console.warn(res);
    
    for (const uid in res.chatMembers
      ) {


      //TODO: find smarter way
      this.markers=[];
      this.dataService.get('users',uid.toString()).then((data:any)=>{
        this.markers.push({
          position: res.chatMembers[uid][0],
          title: 'Her står du nu',
          options: { animation: google.maps.Animation.BOUNCE,
          icon: { 
          url: data.photoURL+'#custom_marker',
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor,
          }
        }})
      
      }) 
  //     if(!this.markers.includes(uid)){
       
  //       this.dataService.get('users',uid.toString()).then((data:any)=>{
  //         this.markers.push({
  //           position: res[uid],
  //           title: 'Her står du nu',
  //           options: { animation: google.maps.Animation.BOUNCE,
  //           icon: { 
  //           url: data.photoURL+'#custom_marker',
  //           scaledSize: new google.maps.Size(40, 40),
  //           origin: new google.maps.Point(0,0), // origin
  //           anchor: new google.maps.Point(0, 0) // anchor,
  //           }
  //         }})
        
  //       }) 

      
  

  // }


}  })
      
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
    
    this.dataService.updateLocation(this.positionObj);
    // this.realTimeUpdate()
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

  searchUser(event:any){
    console.log(event.target.player.value);
    this.dataService.queryUsers(event.target.player.value.toString()).then((res:any[])=>{
      this.searchResults=res;
    })

  }
  selectGroup(group:string){
    this.selectedGroup=group
    this.dataService.currentGroup(this.selectedGroup);
  }
  inviteFriend(friendUID:any){
    let curGroup=this.dataService.currentGroup
    console.log(curGroup);
    this.dataService.sendGroupRequest(friendUID,'Vil du være med i denne gruppe?',this.selectedGroup)
    
  } 

  }
  