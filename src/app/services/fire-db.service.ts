import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getFirestore, doc,addDoc, getDoc, getDocs, setDoc,updateDoc, collection,query, arrayUnion, onSnapshot, where, orderBy  } from "firebase/firestore";
import { AuthService } from './auth.service';
import { Observable, bindCallback, map, Subject } from 'rxjs';
import { docSnapshots } from '@angular/fire/firestore';


export class message {
  id?: string;
  sender?: string;
  content?: string;
  published?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class FireDBService {
  currentGroupVar:string='';
  currentGroupId=new Subject<any>();


  constructor(public authService: AuthService) {



  }
// Genial doc på observables: https://stackoverflow.com/questions/69131797/how-to-handle-onsnapshot-of-firebase-9-in-angular-component-and-service
  async makeUserSearchable(){
    const db = getFirestore();
    let uid = await this.authService.userData.uid;
    let displayName = await this.authService.userData.displayName;
    displayName = displayName.toLowerCase()
    await updateDoc(doc(db, "users", uid),{displayNameLowercase:displayName})
    await updateDoc(doc(db, "users", uid),{groupRequest:[]})
  }

  async createChat(chatNameSetter:string) {
    const db = getFirestore();
    const uid = await this.authService.userData.uid;

    const data = {
      chatName:[chatNameSetter],
      uid,
      chatMembers: {[uid]:{lat:0,lng:0}},
      createdAt: Date.now(),
      messages: []
    };
    
    const docRef= await addDoc(collection(db, "chats"), data)
    console.log(docRef.id);
    await updateDoc(doc(db, "users", uid),{groups:arrayUnion(docRef.id)})
  }

  async sendMessage(chatId:string, content:string) {
    const db = getFirestore();
    const uid = await this.authService.userData.uid;

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {

      const chat = doc(db, "chats", chatId);
  await updateDoc(chat, {
    messages: arrayUnion(data)
});
}
}

async sendGroupRequest(toUserUid:string, message:string, groupUid:string) {
  const db = getFirestore();
  const fromUserUid = await this.authService.userData.uid;

  const data = {
    fromUserUid,
    toUserUid,
    groupUid,
    message,
    createdAt: Date.now()
  };
  console.log(data);
  
    const groupRequest = doc(db, "users", toUserUid);
await updateDoc(groupRequest, {
  groupRequest: arrayUnion(data)
});}

async getUsersFriendRequest(){
    const db = getFirestore();
    const uid = await this.authService.userData.uid;
    console.log(uid);
  
    
    const docSnap2 = await getDoc(doc(db, 'users', uid));
    if (docSnap2.exists()) {
      console.log("Document data:", docSnap2.data());
      let data:any=await docSnap2.data();  
      console.log(data.groupRequest);
      return data.groupRequest;
  
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return}
  
    
    ;
  }
   


//   async getChat(id:any){
//     const db = getFirestore();

//     const docRef = doc(db, "chats", id);
//     const unsub = await onSnapshot(docRef,(res)=>{
//   if (res.exists()) {
//   console.log("Document data:", res.data());
//   return res.data();
// } else {
//   // doc.data() will be undefined in this case
//   console.log("No such document!");
//   return}},(error)=>{console.error(error);
//   }
// );}
  async getChat(id:any){    
    const db = getFirestore();
    const docRef = doc(db, "chats", id);
    return await docSnapshots(docRef).pipe(map(data => data.data()))
    
}

  async get(collection:string,document:string){
    
    const db = getFirestore();
    const docRef = doc(db, collection, document);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  return docSnap.data()
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
  return
}
  }

async getGroups(){
  const db = getFirestore();
  const uid = await this.authService.userData.uid;
  console.log(uid);

  
  const docSnap2 = await getDoc(doc(db, 'users', uid));
  if (docSnap2.exists()) {
    console.log("Document data:", docSnap2.data());
    let data:any=await docSnap2.data();  
    console.log(data.groups);
    return data.groups;

  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return}

  
  ;
}

acceptOrDecline(groupUid:string){
  groupUid
}

async queryUsers(displayName:string){
let results:any[] = [];
const db = getFirestore();
displayName.toLocaleLowerCase()
const snapshot=query(collection(db, 'users'), where('displayNameLowercase', '>=', displayName),where('displayNameLowercase', '<=', displayName+ '\uf8ff'))
const querySnapshot = await getDocs(snapshot);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  results.push(doc.data())
  
});
return results;
}

async updateLocation(data:any){
  const db = getFirestore();
  const uid = await this.authService.userData.uid;
  uid.toString()
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  let userData:any = await docSnap.data();
  
  userData.groups.forEach((element:string) => {
    console.log(element);
   updateDoc(doc(db, "chats", element),
   {['chatMembers.'+uid]:[data]});

    // const docRef = doc(db, "chats", id);
    // return await docSnapshots(docRef).pipe(map(data => data.data()))
    

})}


currentGroup(update?:string){
  if(update){
    this.currentGroupVar=update;
    console.log('update:'+this.currentGroupVar);
    
    return this.currentGroupId.next(update)

  }
  else{return this.currentGroupVar}
}
currenGroupObservable(): Observable<any>{
    return this.currentGroupId.asObservable();
}

}