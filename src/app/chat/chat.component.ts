import { Component, OnInit } from '@angular/core';
import { FireDBService } from '../services/fire-db.service';
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

  constructor(
    public cs: FireDBService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.chat=this.cs.getChat('1')
    // const chatId = this.route.snapshot.paramMap.get('id');
    // const source = this.cs.get(1);
    // console.log(source);
    // this.chat$ = this.cs.joinUsers(source);

  }

  submit(chatId:any) {
    // this.cs.sendMessage(chatId, this.newMsg);
    // this.newMsg = '';
  }

  trackByCreated(i:any, msg:any) {
    return msg.createdAt;
}
}