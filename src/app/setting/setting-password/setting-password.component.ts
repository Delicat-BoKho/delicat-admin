import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-setting-password',
  templateUrl: './setting-password.component.html',
  styleUrls: ['./setting-password.component.css'],
})
export class SettingPasswordComponent {
  faLock = faLock;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  changePassword() {
    // Check if new password and confirm password match
    if (this.newPassword !== this.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    // Check if current password is correct
    // Replace with your own logic to check if current password is correct
    const isCurrentPasswordCorrect = true; // Change this to your own logic
    if (!isCurrentPasswordCorrect) {
      alert('Current password is incorrect.');
      return;
    }

    // Password change successful
    alert('Password changed successfully.');
    this.goToLogin();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
