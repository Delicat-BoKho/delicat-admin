import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-new',
  templateUrl: './content-new.component.html',
  styleUrls: ['./content-new.component.css'],
})
export class ContentNewComponent {
  @Input() editorConfig: any;
  selectedFile!: FileList;
  currentFileUpload: any;
  percentage: number = 0;

  // Sample data
  content = {
    id: '',
    title: '',
    author: '',
    date: '',
    img: '',
    content: '',
  };

  uploadFile() {}
  cancel() {}
}
