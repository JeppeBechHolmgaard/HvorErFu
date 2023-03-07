import { Pipe, PipeTransform } from '@angular/core';
import { FireDBService } from './services/fire-db.service';

@Pipe({
  name: 'whoIsUser',
})
export class WhoIsUserPipe implements PipeTransform {
 
  constructor(private dataService: FireDBService) {}
  private cachedData: any = null;

  transform(uid:string): string {
    this.dataService.get('users',uid.toString()).then((data:any)=>{console.warn(data.displayName)
      this.cachedData=data.displayName.toString();
    },(err)=>{console.error(err);
    })
    
    return this.cachedData;

  }

}
// @Pipe({
//   name: 'whoIsUserName'
// })
// export class WhoIsUserNamePipe implements PipeTransform {
 
//   constructor(private dataService: FireDBService) {}

//   transform(uid:string) {
//     this.dataService.get('users',uid).then((data)=>{ return JSON.stringify(data)});
    
//   }

// }
