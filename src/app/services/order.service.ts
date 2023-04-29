import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Order } from '../models/order';
import { Observable, combineLatest, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}
  getOrders() {
    return this.fireStore
      .collection('/Order')
      .snapshotChanges()
      .pipe(
        map((orders) => {
          return orders.map((order) => {
            const data = order.payload.doc.data() as Order;
            const id = order.payload.doc.id;
            return this.fireStore
              .collection('/Order')
              .doc(id)
              .collection('SaleProducts')
              .get()
              .pipe(
                map((SaleProducts) => {
                  const SaleProductArray = SaleProducts.docs.map(
                    (SaleProduct) => SaleProduct.data()
                  );
                  return { ...data, SaleProducts: SaleProductArray };
                })
              );
          });
        }),
        switchMap((productObservables) => combineLatest(productObservables))
      );
  }

  //get order
}
