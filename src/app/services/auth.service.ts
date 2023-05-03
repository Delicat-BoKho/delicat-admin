import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Customer } from '../models/customer';
import { sha256, sha224 } from 'js-sha256';
import { Admin } from '../models/user';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}
  //login admin
  getUserByUserName(userName: string): Observable<Admin> {
    const userDoc = this.fireStore.collection('/User').doc(userName);
    const user = userDoc.valueChanges() as Observable<Admin>;
    return combineLatest([user]).pipe(
      map(([userData]) => ({
        ...userData,
      }))
    );
  }
  //sign up for admin
  createAdminAccount(user: Admin) {
    const myDoc = this.fireStore.collection('/User').doc(user.userName);
    const userMeta = {
      userName: user.userName,
      passWord: user.password,
      role: user.role,
    };
    //đẩy data lên
    myDoc
      .set(userMeta)
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }

  // login method
  login(email: string, password: string) {
    const passwordHash = CryptoJS.SHA256(password).toString();
    this.fireauth.signInWithEmailAndPassword(email, passwordHash).then(
      async (res) => {
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
        console.log(res);
        if (res.user?.emailVerified == true) {
          //đăng nhập thành công, kiểm tra xem customer này có trong collection customer chưa
          const docRef = firebase.firestore().doc('Customer/' + res.user?.uid);
          docRef
            .get()
            .then(
              (
                docSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
              ) => {
                if (docSnapshot.exists) {
                  // Nếu có rồi thì thôi
                } else {
                  //Nếu chưa có thì tạo mới
                  const myDoc = this.fireStore
                    .collection('/Customer')
                    .doc(res.user?.uid);
                  const customer = new Customer(); //Tạo mới customer theo cấu trúc của Customer
                  const customerMeta = {
                    id: res.user?.uid,
                    name: customer.fullName,
                  };
                  myDoc
                    .set(customerMeta)
                    .then(() => {
                      console.log('Document successfully written!');
                    })
                    .catch((error) => {
                      console.error('Error writing document: ', error);
                    });
                }
              }
            )
            .catch((error: Error) => {
              // Handle errors
            });

          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['/varify-email']);
        }
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      }
    );
  }

  // register method
  register(email: string, password: string) {
    const passwordHash = CryptoJS.SHA256(password).toString();
    this.fireauth.createUserWithEmailAndPassword(email, passwordHash).then(
      (res) => {
        alert('Registration Successful');
        this.sendEmailForVarification(res.user);
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      }
    );
  }

  // sign out
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  // forgot password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/varify-email']);
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  // email varification
  sendEmailForVarification(user: any) {
    console.log(user);
    user.sendEmailVerification().then(
      (res: any) => {
        this.router.navigate(['/varify-email']);
      },
      (err: any) => {
        alert('Something went wrong. Not able to send mail to your email.');
      }
    );
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        this.router.navigate(['/dashboard']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      // Log in the user with their old password
      const userCredential = await this.fireauth.signInWithEmailAndPassword(
        email,
        oldPassword
      );

      // Check if the user's email is verified
      const user = userCredential.user; // user is of type User | null
      if (user && user.emailVerified) {
        // Update the user's password
        await user.updatePassword(newPassword);
        console.log('Password updated successfully');
      } else {
        console.log('User email is not verified');
      }
    } catch (error) {
      console.log('Error updating password:', error);
    }
  }
}
