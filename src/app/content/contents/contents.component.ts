import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css'],
})
export class ContentsComponent {
  @Input() editorConfig: any;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;

  errMessage: string = '';
  contentToDelete: any;

  // Define pagination
  paginationConfig: PaginationInstance = {
    id: 'contents',
    itemsPerPage: 8,
    currentPage: 1,
  };
  onPageChange(pageNumber: number) {
    this.paginationConfig.currentPage = pageNumber;
  }

  // Sample data
  contents: any = [
    {
      id: 'C001',
      title: 'Sample Title',
      img: 'https://via.placeholder.com/150',
      content: 'Sample Content',
      author: 'Sample Author',
      date: '2021-01-01',
    },
    {
      id: 'C002',
      title: 'Sample Title',
      img: 'https://via.placeholder.com/150',
      content: 'Sample Content',
      author: 'Sample Author',
      date: '2021-01-01',
    },
  ];

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    // Code to view all contents here
  }

  confirmDeleteContent(content: any): void {
    this.contentToDelete = content;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  deleteContent() {
    // Code to delete the content here
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  cancelDeleteContent() {
    this.contentToDelete = null;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
