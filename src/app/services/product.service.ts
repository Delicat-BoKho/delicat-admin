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
    const fileMeta = {
      id : '',
      name : product.name,
      type: product.type,
      price: product.price,
      imgURL: product.imgURL,
      describe: product.describe,
      tag: product.tag,
      size: product.size,
      color: product.color,
    }

    fileMeta.id = this.fireStore.createId();

    this.fireStore.collection('/Product').add(fileMeta).then( res => console.log("save to firestore successfully!", res));

  }

  // dislpay products
  getProducts() {
    return this.fireStore.collection('/Product').snapshotChanges();
  }

  // delete products
  deleteProduct(product : Product) {
    this.fireStore.collection('/Product').doc(product.id).delete().then(() => {
      console.log('Product successfully deleted');
    }).catch((error) => {
      console.error('Error deleting product: ', error);
    });


  }
  //hạn chế up nhầm hình
  updateProduct(product : Product){
    this.fireStore.collection('/Product').doc(product.id).set(product, { merge: true }).then(() => {
      console.log('Product successfully deleted');
    }).catch((error) => {
      console.error('Error deleting product: ', error);
    });

  }
}
