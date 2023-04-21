import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product';


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
    return this.fireStore.collection('/Product').snapshotChanges();
  }
  // display one product

  getProductById(productId: string) {
    return this.fireStore.collection('/Product').doc(productId).snapshotChanges();
  }

  // delete products
  deleteProduct(product : Product) {

    // for (let i=0;i< product.reviews.length;i++){
    //   this.fireStore.collection('/Product').doc(product.id).collection('reviews').doc(product.reviews[i].id).delete().then(() => {
    //     console.log('Product successfully deleted');
    //   }).catch((error) => {
    //     console.error('Error deleting product: ', error);
    //   });
    // }


    this.fireStore.collection('/Product').doc(product.id).delete().then(() => {
      console.log('Product successfully deleted');
    }).catch((error) => {
      console.error('Error deleting product: ', error);
    });

  }


}
