import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { faL, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { Admin } from 'src/app/models/user';

@Component({
  selector: 'app-setting-password',
  templateUrl: './setting-password.component.html',
  styleUrls: ['./setting-password.component.css'],
})
export class SettingPasswordComponent implements AfterViewInit {
  faLock = faLock;
  currentPassword: string = '';
  newPassword: any;
  confirmPassword: any;
  userName: string = '';
  confirmPassMessage: string = '';
  message: string = '';
  hashPassWord: string = '';
  loginSuccess: boolean = false;
  confirmSuccess: boolean = false;
  user = new Admin();
  constructor(private router: Router, private service: AuthService) {}
  ngAfterViewInit() {
    const confirmPassword = document.getElementById(
      'confirmPassword'
    ) as HTMLInputElement;
    //khi confirm pass thay đổi và không focus thì sẽ chạy hàm
    confirmPassword.onchange = () => {
      if (this.newPassword == this.confirmPassword) {
        this.confirmPassMessage = '';
        console.log('valid');
      } else {
        this.confirmPassMessage =
          'New password and confirm password do not match.';
      }
    };
  }
  getUser(userName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.hashPassWord = CryptoJS.SHA256(this.currentPassword).toString();
      this.service.getUserByUserName(userName).subscribe({
        next: (res: any) => {
          if (Object.keys(res).length === 0) {
            this.message = 'Invalid data';
            reject(this.message); // trả về lỗi nếu không tìm thấy dữ liệu
          } else if (res == null) {
            this.message = 'Invalid data';
            reject(this.message); // trả về lỗi nếu không tìm thấy dữ liệu
          } else {
            if (this.hashPassWord == res.passWord) {
              this.loginSuccess = true;
              console.log(this.loginSuccess);
              console.log('dang nhap thanh cong');
              resolve(res); // trả về dữ liệu nếu đăng nhập thành công
            } else {
              this.message = 'Invalid data';
              reject(this.message); // trả về lỗi nếu mật khẩu không đúng
            }
          }
        },
        error: (err: any) => {
          reject(err); // trả về lỗi nếu có lỗi xảy ra trong quá trình lấy dữ liệu
        },
      });
    });
  }
  async changePassword(userName: string) {
    await this.getUser(userName); // đợi cho hàm getUser kết thúc
    // Check if new password and confirm password match
    if (this.loginSuccess && this.newPassword == this.confirmPassword) {
      this.user.userName = userName;
      this.user.passWord = this.newPassword;
      this.updateAdminUser(this.user);
      alert('Password changed successfully.');
    } else {
      alert('New password and confirm password do not match.');
      return;
    }
    this.goToLogin();
  }
  updateAdminUser(user: Admin) {
    this.service.createAdminAccount(user);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
