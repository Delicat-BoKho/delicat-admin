import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product';
import { Observable, combineLatest, map, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fireStore : AngularFirestore, private fireStorage : AngularFireStorage) { }

  // save meta data of file to firestore
  saveMetaDataOfFile(product : Product) {
    //Tạo một document có id tương tự như id nhập tay
    //Đẩy cùng id thì nó sẽ tự động ghi đè dữ liệu
    const myDoc = this.fireStore.collection('/Product').doc(product.id);
    //Tạo subcollection cho mảng reviews
    const subCollection = myDoc.collection('reviews').doc(product.reviews[0].id).ref;
    //Tạo một file json vì firebase chỉ nhận data dạng json, không nhận dạng class nên ko đẩy trực tiếp được
    const productMeta = {
      id : product.id,
      name : product.name,
      type: product.type,
      price: product.price,
      imgURL: product.imgURL,
      describe: product.describe,
      tag: product.tag,
      size: product.size,
      color: product.color,
    }

    //đẩy data lên
    myDoc.set(productMeta)
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
    });
    subCollection.set(
      {
        id:product.reviews[0].id,
        ratingComment: product.reviews[0].ratingComment,
        userName: product.reviews[0].userName,
        dateCreate: product.reviews[0].dateCreate,
        review: product.reviews[0].review
      }
    )
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
    });


  }

  // dislpay products

  getProducts() {
    return this.fireStore.collection('/Product').snapshotChanges().pipe(
      map(products => {
        return products.map(product => {
          const data = product.payload.doc.data() as Product;
          const id = product.payload.doc.id;
          return this.fireStore.collection('/Product').doc(id).collection('reviews').get().pipe(
            map(reviews => {
              const reviewsArray = reviews.docs.map(review => review.data());
              return {...data, reviews: reviewsArray };
            })
          );
        });
      }),
      switchMap(productObservables => combineLatest(productObservables)),
    );

  }

  // display one product

  getProduct(): Observable<Product> {
    const productId = "S001"
    const productDoc = this.fireStore.collection('/Product').doc(productId);
    const product = productDoc.valueChanges() as Observable<Product>;
    const reviews = productDoc.collection<any>('reviews').valueChanges();
    return combineLatest([product, reviews]).pipe(
      map(([productData, reviewsData]) => ({ ...productData, reviews: reviewsData }))
    );
  }

  // delete products
  async deleteProduct(product: Product) {
    const productDocRef = this.fireStore.collection('/Product').doc(product.id).ref;
    const reviewsCollectionRef = this.fireStore.collection('/Product').doc(product.id).collection('reviews').ref;

    const batch = this.fireStore.firestore.batch();
    batch.delete(productDocRef);
    const deleteReviewsQuery = await reviewsCollectionRef.limit(500).get();
    deleteReviewsQuery.forEach((doc) => batch.delete(doc.ref));

    batch.commit().then(() => {
      console.log('Product and reviews successfully deleted');
    }).catch((error) => {
      console.error('Error deleting product and reviews: ', error);
    });
  }

  updateProduct(product : Product) {
    //Tạo một document có id tương tự như id nhập tay
    //Đẩy cùng id thì nó sẽ tự động ghi đè dữ liệu
    const myDoc = this.fireStore.collection('/Product').doc(product.id);
    //Tạo subcollection cho mảng reviews
    const subCollection = myDoc.collection('reviews').doc(product.reviews[0].id).ref;
    //Tạo một file json vì firebase chỉ nhận data dạng json, không nhận dạng class nên ko đẩy trực tiếp được
    const productMeta = {
      id : product.id,
      name : product.name,
      type: product.type,
      price: product.price,
      imgURL: product.imgURL,
      describe: product.describe,
      tag: product.tag,
      size: product.size,
      color: product.color,
    }

    //đẩy data lên
    myDoc.set(productMeta)
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
    });
  }

}
