import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Content } from 'src/app/models/content';
import { AuthService } from 'src/app/services/auth.service';
import { ContentService } from 'src/app/services/content.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css'],
})
export class ContentEditComponent implements OnInit {
  @ViewChild('saveChangesConfirmationModal') saveChangesConfirmationModal: any;
  modalRef: BsModalRef | null = null;
  selectedFile!: FileList;
  percentage: number = 0;
  editable: boolean = false;
  content: any;
  contentTemp = new Content();
  // Define angular-editor configurations
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    toolbarHiddenButtons: [['insertImage', 'insertVideo', 'fontName']],
  };
  ngOnInit(): void {
    // Code to view all products here
    this.authService.checkValidUser();
  }
  constructor(
    private modalService: BsModalService,
    private cService: ContentService,
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id) {
        this.getCurrentContent(id);
      }
    });
  }

  convertToDate(dateString: string): Date {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const [monthName, day, year] = dateString.split(' ');
    const month = months.findIndex((name) => name === monthName) + 1;
    const date = new Date(`${year}-${month}-${day}`);
    return date;
  }
  getCurrentContent(id: string) {
    this.cService.getContentById(id).subscribe({
      next: (data) => {
        this.content = data;
        this.contentTemp = this.content;
        this.content.date = this.convertToDate(this.content.date)
          .toISOString()
          .slice(0, 10);
      },
      error: (error) => {
        console.log('Error getting content by id: ', +error);
      },
    });
  }
  formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const formattedDate: string = date.toLocaleDateString('en-US', options);
    return formattedDate.replace(',', '');
  }

  toggleEdit() {
    this.editable = !this.editable;
    this.editorConfig.editable = !this.editorConfig.editable;
  }

  selectFile(event: any) {
    this.selectedFile = event.target.files;
  }

  async updateLoadFileContent() {
    const id = this.content.id;
    const promises = [];
    let url: string;
    if (this.selectedFile && this.selectedFile.length > 0) {
      const path = 'content/' + this.selectedFile[0].name;
      const fileRef = this.fireStorage.ref(path);
      const uploadTask = fileRef.put(this.selectedFile[0]);
      const promise = new Promise((resolve, reject) => {
        uploadTask
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((downloadLink) => {
                this.content.img = downloadLink;
                resolve(undefined);
              }, reject);
            })
          )
          .subscribe({
            next: (res: any) => {
              this.percentage = (res.bytesTransferred * 100) / res.totalBytes;
            },
            error: (err) => {
              console.log('Error occurred');
              reject(err);
            },
          });
      });
      promises.push(promise);
    }
    // Update the content object with the download URL and create the new content document
    await Promise.all(promises);
    this.content.date = this.formatDate(this.content.date);
    await this.cService.createNewContent(this.content);
    console.log('Content updated successfully!');
  }

  goBack() {
    this.router.navigate(['/contents']);
  }

  resetForm() {
    this.content = new Content();
  }

  confirmSaveChanges(content: Content) {
    this.content = content;
    this.modalRef = this.modalService.show(this.saveChangesConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  updateContent(content: Content) {
    this.cService.updateContent(content);
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  cancel() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
