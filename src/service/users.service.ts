import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, filter, scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(private firestore: AngularFirestore) { }

  getUsers(){
    let docs = this.firestore.doc('crm_users/user_info');

    return docs.snapshotChanges().pipe(
			map( actions => {
        const data = actions.payload.data();
        const id = actions.payload.id;

        return { id, data };
			})
    )
  }

}
