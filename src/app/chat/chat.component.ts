import { Component, OnInit } from '@angular/core';
import { FireDBService, message } from '../services/fire-db.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chat$!: Observable<any>;
  newMsg!: string;
  chat:any;
  chatId: any;
  source: any;

  constructor(
    public cs: FireDBService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {
    this.source=null;
    
    
    
  }

  async ngOnInit():Promise<void> {
    this.cs.currenGroupObservable().subscribe(async(res:string) =>{
      this.chatId=res
      let chatRes$ = await this.cs.getChat(this.chatId)
      await chatRes$.subscribe((messages:any) => {
        if(messages==undefined){
          console.log('no messages yet');
        }else{
          console.log(messages);
          messages.messages.forEach((element:any) => {
          this.cs.get('users',element.uid).then((data:any)=>{
            element.displayName=data.displayName;
            element.photoURL=data.photoURL;
  
            });
  
        })
        this.source=messages.messages;
      }})

    })
    
        // if(messages){
        // console.log(messages);
        // messages.forEach((element:any) => {
        // this.cs.get('users',element.uid).then((data:any)=>{console.log(data)});
        //   });
        // }
        // element.displayName=data.displayName;
      
          
      
    }
    // this.chat$ = this.cs.joinUsers(source);

  

  

  submit() {
    this.cs.sendMessage(this.chatId, this.newMsg);
    this.newMsg = '';
  }
  createChatService(){
    this.cs.createChat('testChat')
    console.log('button worked');
    
  }
  trackByCreated(i:any, item:any) {
    return item.createdAt;
}
}