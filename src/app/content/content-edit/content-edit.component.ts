import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css'],
})
export class ContentEditComponent {
  @Input() editorConfig: any;
  selectedFile!: FileList;
  currentFileUpload: any;
  percentage: number = 0;

  // Sample data
  content = {
    id: 'C001',
    title: 'Sample Title',
    author: 'Sample Author',
    date: '2021-01-01',
    img: '',
    content: 'Sample Content',
  };

  uploadFile() {}
  cancel() {}
}
