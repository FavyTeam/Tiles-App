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

  createContacts(week : String, count : Number){
    
    let city: any;
    city = Object.assign({}, {
      weekname: week,
      count_contact: count
    });

    this.firestore.collection<Contact>('crm_users_result').add(city);
  }

  updateContacts(contact : Contact){
    // delete contact.id;
    // this.firestore.collection('crm_users_result').update(contact);
  }



}
