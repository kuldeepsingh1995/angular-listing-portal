import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Users} from '../../entities/users';
import { AngularFireList } from '@angular/fire/database';

// import { Timesheet } from 'src/app/entity/timesheet';
@Injectable()
export class UserService {
  headers_object;
  UsersRef: AngularFireList<Users>;

  constructor(private firestore: AngularFirestore) {
    // this.timesheetRef = db.list('timesheet');
  }
  addItemWithDoc(doc, data: any) {
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("users")
          .doc(doc)
          .set(data)
          .then(res => {
            resolve(res);
          }, err => reject(err));
    });
  }
  addItem(data: any) {
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection("users")
          .add(data)
          .then(res => {
            resolve(res);
          }, err => reject(err));
    });
  }
  getItem(id){
    let Item = this.firestore.collection('users').doc(id).valueChanges();
     return Item;
 }
  updateCoffeeOrder(data) {
    return this.firestore
        .collection("users")
        .doc(data.payload.doc.id)
        .set({ completed: true }, { merge: true });
 }
 updateItem(data) {
  return this.firestore
      .collection("users")
      .doc(data.id)
      .set(data);
}
searchWithId(uid: any){
  let ItemCollection  = this.firestore.collection('users', ref => ref.where('uid', '==', uid))
  let items = ItemCollection.snapshotChanges().pipe(
    map(changes =>
      changes.map((c: any) =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      )
    )
  );
  return items;
}
  searchUser(uid: any) {
      return this.firestore.collection('users', ref => ref.where('uid', '==', uid)).valueChanges()

    /*  #A) one way of applying search query:
        In case when we have `single` where statement to search.
        this query will result list of employee matched with
        given employee.name parameter
    */
    // 👇 un-comment this code to use single-query👇
    // return this.firestore.collection(
    //   'Employees', ref => ref.where('name', '==', employee.name)).snapshotChanges();

    /* #B) second way of applying search query:
        In case when we have `multiple` where statement to search.
        this query will result list of employee matched with
        all given parameters:
        #1. Query for `multiple` where statement.
        #2. Query for range '>=' operators.
        #3. Query order by `ascending`.
        #4. Query order by `descending` by date or strings.
        #5. Apply limit to Query result.
        #6. Offset by a property, suppose we want employee whose
            name starts with `An` then apply startAt('An')
    */

    /*
      After applying these query you may face this error:
      "ERROR FirebaseError: The query requires an index. You can create it here: URL"
      You will get above error with an URL - Click over that URL - Login in Firebase
      and this will prompt to Create an Index which is required in Firebase 
      to apply queries to Database Collection.
    */

    // return this.firestore.collection(
    //   'Employees', ref => {
    //     // declare var `query` of type either `CollectionReference` or `Query`
    //     let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

    //     // 👇 the below conditions will be applied to query
    //     // 👇 only when params have value in given `employee` object.

    //     // where condition to match employee with given phone
    //     if (user.phone) {
    //       query = query.where('phone', '==', user.phone);
    //     }
    //     // where condition to match user with given salary
    //     if (user.salary) {
    //       // #2. Get items by range '>=' operators, this query
    //       // will return the user whose salary is
    //       // greater than or equal to given `user.salary`
    //       query = query.where('salary', '>=', user.salary);
    //     }
    //     // where condition to match user with given designation
    //     if (user.designation) {
    //       query = query.where('designation', '==', user.designation);
    //     }
    //     // where condition to match user with given joinDate
    //     if (user.joinDate) {
    //       // covert date string to date object
    //       user.joinDateTimestamp = new Date(user.joinDate);
    //       query = query.where('joinDateTimestamp', '==', user.joinDateTimestamp);
    //     }

    //     /* #3 also apply query to salary order by `ascending`. */
    //     // query = query.orderBy('salary', 'asc');

    //     /* #4 apply query to joinDateTimestamp order by `descending`. */
    //     // query = query.orderBy('joinDateTimestamp', 'desc');

    //     /* #5. Apply limit to Query result.
    //        default order by is ascending (when we not pass second param to orderBy)
    //        this query will return only 2 employees
    //     */
    //     // query = query.orderBy('designation').limit(2);

    //     /* IMPORTANT: Reason I put this query at last because
    //      * We can not call Query.startAt() or Query.startAfter()
    //      * before calling Query.orderBy().
    //     */

    //     // where condition to match employee with given name
    //     if (user.name) {
    //       /* look: orderBy and equality '==' cannot apply together.
    //           that is the reason I comment this equality
    //       */
    //       // query = query.where('name', '==', employee.name);

    //       // #6. Offset by a property, suppose we want employee whose
    //       // name starts with `An` then apply startAt('An')
    //       query = query.orderBy('name', 'asc').startAt('An');

    //       /* similar query `endAt`, `startAfter` and `endBefore`
    //           can be applied like this:
    //       */
    //       // query = query.endAt('An');
    //       // query = query.startAfter('An');
    //       // query = query.endBefore('An');
    //     }

    //     // finally return query back to the collection second argument.
    //     return query;
    // }).snapshotChanges();
  }



   // getCustomItems(emp_id){
  //   const queryObservable = this.db.list('/timesheet');
  //   console.log(queryObservable);
  // }
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
