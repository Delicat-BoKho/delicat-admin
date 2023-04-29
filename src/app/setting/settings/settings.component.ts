import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  account: any = {
    name: 'John Doe',
    username: 'johndoe',
    password: '123456',
    phone: '',
  };

  showPassword: boolean = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  // Define the modal reference variable
  @ViewChild('logoutDialog') logoutDialog!: TemplateRef<any>;

  // Define the modal configuration options
  modalConfig = {
    backdrop: true,
    keyboard: false,
    animated: true,
    class: 'modal-dialog-centered',
  };

  // Declare the modal reference object
  logoutModalRef!: BsModalRef;

  constructor(private modalService: BsModalService) {}

  // Method to open the modal
  openLogoutDialog() {
    this.logoutModalRef = this.modalService.show(
      this.logoutDialog,
      this.modalConfig
    );
  }

  // Method to handle the logout action
  logout() {
    // Perform the logout action
    // ...
    // Hide the modal
    this.logoutModalRef.hide();
  }

  changePassword() {
    // Perform the change passwordn
    // ...
  }
}
