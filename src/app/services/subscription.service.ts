import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subscription } from '../../entities/subscription';
@Injectable()
export class SubscriptionService {
  headers_object;
  listingRef: AngularFireList<Subscription>;

  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore) {
    // this.timesheetRef = db.list('timesheet');

  }
  cancelSubscription(subscription) {
   
    // const url = 'https://us-central1-spotleads-4ca8b.cloudfunctions.net/cancelSubcription';
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Accept': '*/*',
    //     // 'Host': 'https://us-central1-spotleads-4ca8b.cloudfunctions.net'
    //   })
    // };

    // console.log({subscriptionId: subscription.stripeSubscriptionId })
    // return this.http.post(url, {subscriptionId: subscription.stripeSubscriptionId }, httpOptions);

    const url = 'https://us-central1-spotleads-4ca8b.cloudfunctions.net/cancelSubcription?subscriptionId='+subscription.stripeSubscriptionId+'&id='+subscription.id

    return this.http.get(url);
  }
  searchSubscription(uid){
    return this.firestore.collection('subscriptions', ref => ref.where('uid', '==', uid).where('status', '==', 'active')).valueChanges()
  }
  getItem(id){
     let Item = this.firestore.collection('subscriptions').doc(id).valueChanges();
      return Item;
  }
  addItem(data: Subscription) {
    console.log(data, 'saveData')
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("subscriptions")
          .add(data)
          .then(res => {
            resolve(res);
          }, err => reject(err));
    });
  }
  updateItem(data) {
    return this.firestore
        .collection("subscriptions")
        .doc(data.id)
        .set(data);
 }
 deleteItem(id){
   console.log(id, 'id')
  this.firestore.collection("subscriptions").doc(id).delete().then(() => {
     return true;
  }).catch((error) => {
    return false;
  });
 }
  search(searchParams) {

    let ItemCollection  = this.firestore.collection('subscriptions', (ref: any) => {

      let query = ref;

      if (searchParams.where && searchParams.where.length > 0) {
        searchParams.where.forEach((ob) => {
          // console.log(ob, 'ob')
         query = query.where(ob.key,'==',ob.value);
        })
      } 

      return query;
    });
    let items = ItemCollection.snapshotChanges().pipe(
      map(changes =>
        changes.map((c: any) =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    );
    return items;
      
  }
}
