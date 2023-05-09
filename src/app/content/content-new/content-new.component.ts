import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Content } from 'src/app/models/content';
import { AuthService } from 'src/app/services/auth.service';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-content-new',
  templateUrl: './content-new.component.html',
  styleUrls: ['./content-new.component.css'],
})
export class ContentNewComponent implements OnInit {
  content: Content = new Content();
  selectedFile!: FileList;
  percentage: number = 0;

  // Define angular-editor configurations
  editorConfig: AngularEditorConfig = {
    editable: true,
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
    private cService: ContentService,
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) {}

  selectFile(event: any) {
    this.selectedFile = event.target.files;
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

  async uploadFile() {
    const id = this.content.id;
    const file = this.selectedFile[0];
    const filePath = `content/${id}/${file.name}`;
    const fileRef = this.fireStorage.ref(filePath);

    try {
      // Start the upload task and get the upload percentage
      const task = this.fireStorage.upload(filePath, file);
      task.percentageChanges().subscribe((percentage) => {
        this.percentage = percentage ?? 0; // Use 0 if percentage is undefined
      });

      // Wait for the upload to complete and get the download URL
      await task;
      const url = await fileRef.getDownloadURL().toPromise();

      // Update the content object with the download URL and create the new content document
      this.content.img = url;
      this.content.date = this.formatDate(this.content.date);
      await this.cService.createNewContent(this.content);

      console.log('Content created successfully!');
      this.resetForm();
    } catch (error) {
      console.error('Error creating new content:', error);
    }
  }

  cancel() {
    this.router.navigate(['/contents']);
  }

  resetForm() {
    this.content = new Content();
  }
}
