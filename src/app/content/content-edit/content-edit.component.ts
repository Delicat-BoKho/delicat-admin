import { Component, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Content } from 'src/app/models/content';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css'],
})
export class ContentEditComponent {
  selectedFile!: FileList;
  percentage: number = 0;
  editable: boolean = false;
  content: any;

  // Define angular-editor configurations
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    toolbarHiddenButtons: [['insertImage', 'insertVideo', 'fontName']],
  };

  constructor(
    private cService: ContentService,
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

  async updateContent() {
    const id = this.content.id;

    let url: string;
    if (this.selectedFile && this.selectedFile.length > 0) {
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
        url = await fileRef.getDownloadURL().toPromise();
      } catch (error) {
        console.error('Error uploading file:', error);
        return;
      }
    } else {
      // If no file is selected, get the download URL of the existing image
      const existingRef = this.fireStorage.ref(this.content.img);
      url = await existingRef.getDownloadURL().toPromise();
    }
    // Update the content object with the download URL and create the new content document
    this.content.img = url;
    this.content.date = this.formatDate(this.content.date);
    await this.cService.createNewContent(this.content);
    console.log('Content updated successfully!');
    this.resetForm();
  }

  cancel() {
    this.router.navigate(['/contents']);
  }

  resetForm() {
    this.content = new Content();
  }
}
