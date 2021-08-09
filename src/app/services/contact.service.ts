import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { AngularFirestore } from '@angular/fire/firestore';

// import { Timesheet } from 'src/app/entity/timesheet';
@Injectable()
export class ContactService {
  headers_object;
  constructor(private firestore: AngularFirestore) {
    // this.timesheetRef = db.list('timesheet');
  }
  // getCustomItems(emp_id){
  //   const queryObservable = this.db.list('/timesheet');
  //   console.log(queryObservable);
  // }
  addItem(data: any) {
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("contacts")
          .add(data)
          .then(res => {
            resolve(res);
          }, err => reject(err));
    });
  }

  // updateItem(key: string, newText: {}) {
  //   this.timesheetRef.update(key, newText);
  // }

  // deleteUser(key: string) {
  //   this.timesheetRef.remove(key);
  // }

  // listData(key,val) {
  //   // return this.timesheetRef;
  //   return this.db.list('/timesheet', ref => ref.orderByChild(key).equalTo(val));
  // }

  // deleteEverything() {
  //   //this.itemsRef.remove();
  // }

  // searchByKey(key,val){
  //  // console.log(key+'hhh'+val);
  //  return this.db.list('/timesheet', ref => ref.orderByChild(key).equalTo(val));
  // }

  // seacrhUserById(id){
  //   return this.db.list('/timesheet', ref => ref.orderByChild('id').equalTo(id));
  // }
  // seacrhUserByStatus(id){
  //   //return this.db.list('/users', ref => ref.orderByChild('roleStatus').equalTo(0));
  //   firebase.database().ref('/timesheet').orderByChild('roleStatus').equalTo(0).once('value').then(snapshot => {
  //     snapshot.forEach(child => {
  //       const post = child.val();
  //       post.key = child.key;
  //       return post;
  //     });
  //   })
  // }

}
