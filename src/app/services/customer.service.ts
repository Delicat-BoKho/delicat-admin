import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, combineLatest, forkJoin, map, switchMap } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}
  getCustomers() {
    return this.fireStore
      .collection('/Customer')
      .snapshotChanges()
      .pipe(
        map((customers) => {
          return customers.map((customer) => {
            const data = customer.payload.doc.data() as Customer;
            const id = customer.payload.doc.id;
            return this.fireStore
              .collection('/Customer')
              .doc(id)
              .collection('cart')
              .get()
              .pipe(
                map((cart) => {
                  const cartArray = cart.docs.map((cart) => cart.data());
                  return { ...data, cart: cartArray };
                })
              );
          });
        }),
        switchMap((productObservables) => combineLatest(productObservables))
      );
  }
  async deleteCustomer(id: string) {
    const customerDocRef = this.fireStore.collection('/Customer').doc(id).ref;
    const cartCollectionRef = this.fireStore
      .collection('/Customer')
      .doc(id)
      .collection('cart').ref;

    const batch = this.fireStore.firestore.batch();
    batch.delete(customerDocRef);
    const deleteCustomerQuery = await cartCollectionRef.limit(500).get();
    deleteCustomerQuery.forEach((doc) => batch.delete(doc.ref));
    batch
      .commit()
      .then(() => {
        console.log('Customer and reviews successfully deleted');
      })
      .catch((error) => {
        console.error('Error deleting product and reviews: ', error);
      });
  }
  getCustomer(id: string): Observable<Customer> {
    const customerDoc = this.fireStore.collection('/Customer').doc(id);
    const customer = customerDoc.valueChanges() as Observable<Customer>;
    const cart = customerDoc.collection<any>('cart').valueChanges();
    return combineLatest([customer, cart]).pipe(
      map(([customerData, cartData]) => ({
        ...customerData,
        cart: cartData,
      }))
    );
  }
}
