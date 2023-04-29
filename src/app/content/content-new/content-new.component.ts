import { Component, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-content-new',
  templateUrl: './content-new.component.html',
  styleUrls: ['./content-new.component.css'],
})
export class ContentNewComponent {
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
