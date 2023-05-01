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
export class SignUpComponent implements OnInit {
  public userName: string = '';
  public passWord: string = '';
  hashPassword: string = '';
  errMessage: string = '';
  admin = new Admin();
  async signUp() {
    this.hashPassword = CryptoJS.SHA256(this.passWord).toString();
    this.admin.passWord = this.hashPassword;
    this.admin.userName = this.userName;
    this.service.createAdminAccount(this.admin);
  }

  constructor(
    private FormsModule: FormsModule,
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private service: AuthService
  ) {}
  ngOnInit(): void {}
}