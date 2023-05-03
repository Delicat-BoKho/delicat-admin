import { Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { Admin } from '../models/user';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  faEnvelope = faEnvelope;
  faLock = faLock;
  public userName: string = '';
  public passWord: string = '';
  hashPassWord: string = '';
  errMessage: string = '';
  constructor(private service: AuthService, private router: Router) {}
  Login(userName: string) {
    this.hashPassWord = CryptoJS.SHA256(this.passWord).toString();
    this.service.getUserByUserName(userName).subscribe({
      next: (res: any) => {
        if (res.role == 'admin') {
          if (Object.keys(res).length === 0) {
            this.errMessage = 'Invalid data';
          } else if (res == null) {
            this.errMessage = 'Invalid data';
          } else {
            if (this.hashPassWord == res.passWord) {
              this.errMessage = 'Login successfull';
              this.router.navigate(['orders']);
            } else {
              this.errMessage = 'Invalid data';
            }
          }
        } else {
          this.errMessage = 'Invalid data';
        }
      },
    });
  }
  ngOnInit() {}
}
