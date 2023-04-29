import { Component, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.css'],
})
export class ContentEditComponent {
  selectedFile!: FileList;
  currentFileUpload: any;
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
