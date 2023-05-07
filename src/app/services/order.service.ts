import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Order } from '../models/order';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { or } from '@angular/fire/firestore';

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
              .collection('saleProducts')
              .get()
              .pipe(
                map((saleProducts) => {
                  const saleProductArray = saleProducts.docs.map(
                    (saleProduct) => saleProduct.data()
                  );
                  return { ...data, saleProducts: saleProductArray };
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
      .collection<any>('saleProducts')
      .valueChanges();
    return combineLatest([order, saleProducts]).pipe(
      map(([orderData, saleProducts]) => ({
        ...orderData,
        saleProducts: saleProducts,
      }))
    );
  }

  async deleteOrder(id: string) {
    const orderDocRef = this.fireStore.collection('/Order').doc(id).ref;
    const saleProductsCollectionRef = this.fireStore
      .collection('/Order')
      .doc(id)
      .collection('saleProducts').ref;

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
 saveMetaDataOfFile(order: Order) {
    //Tạo một document có id tương tự như id nhập tay
    //Đẩy cùng id thì nó sẽ tự động ghi đè dữ liệu
    const myDoc = this.fireStore.collection('/Order').doc(order.id);
    //Tạo subcollection cho mảng reviews
    const orderMeta = {
      deliveryAddress: order.deliveryAddress,
      id: order.id,
      customerId: order.customerId,
      total: order.total,
      dateCreated: order.dateCreated,
      paymentMethod: order.paymentMethod,
      status: order.status,
    };
    //đẩy data lên
    myDoc
      .set(orderMeta)
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }
  //get order by ids
  getOrdersByIds(orderIds: string[]): Observable<Order[]> {
    return this.fireStore
      .collection<Order>('/Order', (ref) => ref.where('id', 'in', orderIds))
      .valueChanges();
  }
}
