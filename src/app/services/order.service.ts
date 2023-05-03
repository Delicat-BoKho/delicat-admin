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
  getOrder(id: string): Observable<Order> {
    const orderDoc = this.fireStore.collection('/Order').doc(id);
    const order = orderDoc.valueChanges() as Observable<Order>;
    const saleProducts = orderDoc
      .collection<any>('SaleProducts')
      .valueChanges();
    return combineLatest([order, saleProducts]).pipe(
      map(([orderData, saleProducts]) => ({
        ...orderData,
        SaleProducts: saleProducts,
      }))
    );
  }

  async deleteOrder(order: Order) {
    const orderDocRef = this.fireStore.collection('/Order').doc(order.id).ref;
    const saleProductsCollectionRef = this.fireStore
      .collection('/Order')
      .doc(order.id)
      .collection('SaleProducts').ref;

    const batch = this.fireStore.firestore.batch();
    batch.delete(orderDocRef);
    const deleteSaleProductsQuery = await saleProductsCollectionRef
      .limit(500)
      .get();
    deleteSaleProductsQuery.forEach((doc) => batch.delete(doc.ref));

    batch
      .commit()
      .then(() => {
        console.log('order and reviews successfully deleted');
      })
      .catch((error) => {
        console.error('Error deleting order and reviews: ', error);
      });
  }
  //get order by ids
  getOrdersByIds(orderIds: string[]): Observable<Order[]> {
    return this.fireStore
      .collection<Order>('/Order', (ref) => ref.where('id', 'in', orderIds))
      .valueChanges();
  }
}
