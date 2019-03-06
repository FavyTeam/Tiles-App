import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contact } from '../model/contact.model';
import { map } from 'rxjs/operators';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private firestore: AngularFirestore) { 

  }

  documentToDomainObject = (_) => {
      const object = _.payload.doc.data();
      object.id = _.payload.doc.id;
      return object;
  }

  getContacts(){
    let collections =  this.firestore.collection('crm_users_result').snapshotChanges();

    return collections.pipe(
      map(actions => actions.map(this.documentToDomainObject)
      )
    )
    
  }

  createContacts(week : String, count : any){

    this.getContacts().subscribe(e => {
      var result = 0
      var sameID : any

      e.forEach(item => {
        // item.count_contact
        // item.weekname
        if (week == item.weekname){
          // data is already exist
          sameID = item.id
          result = 1;
          if (Math.abs(count - item.count_contact) > 0){
            // update record
            result = 2;
          }
        }
      })

      let city: any;
      city = Object.assign({}, {
        weekname: week,
        count_contact: count
      })

      if (result == 0){
        // not exist
        this.firestore.collection<Contact>('crm_users_result').add(city);
      }else if (result == 1){
        // exist but count is not increase

      }else{
        // exist and count is increase, need to update
        this.firestore.doc('crm_users_result/' + sameID).update({count_contact: count})
      }
    })
  }

}
