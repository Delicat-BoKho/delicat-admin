import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Admin } from '../models/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  public userName: string = '';
  public password: string = '';
  hashPassword: string = '';
  errMessage: string = '';
  admin = new Admin();
  async signUp() {
    this.hashPassword = CryptoJS.SHA256(this.password).toString();
    this.admin.password = this.hashPassword;
    this.admin.userName = this.userName;
    this.admin.role = 'admin';
    this.service.createAdminAccount(this.admin);
  }

  constructor(
    private FormsModule: FormsModule,
    private fireStore: AngularFirestore,
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
    private service: AuthService
  ) {}
}
