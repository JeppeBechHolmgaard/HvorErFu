import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getFirestore, doc, getDoc, updateDoc, collection  } from "firebase/firestore";


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
  

  constructor() {


  }
  async getChat(id:any){
    const db = getFirestore();

    const docRef = doc(db, "chats", id);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  let data = docSnap.data()
  console.log(JSON.stringify(data));
  
  return JSON.stringify(data)
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
  return
}
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



async updateLocation(data:any){
  const db = getFirestore();
  
  const aalborg = doc(db, "locationGroups", "testGroup");
  await updateDoc(aalborg, data);
}

}