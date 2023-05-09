import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Content } from 'src/app/models/content';
import { AuthService } from 'src/app/services/auth.service';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css'],
})
export class ContentsComponent implements OnInit {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;

  contents: Content[] = [];
  contentToDelete: Content | null = null;

  // Define pagination
  paginationConfig: PaginationInstance = {
    id: 'contents',
    itemsPerPage: 8,
    currentPage: 1,
  };
  onPageChange(pageNumber: number) {
    this.paginationConfig.currentPage = pageNumber;
  }

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,

    private cService: ContentService
  ) {}

  ngOnInit(): void {
    this.getContents();
    this.authService.checkValidUser();
  }

  getContents() {
    this.cService.getContents().subscribe({
      next: (res: any) => {
        this.contents = res;
        console.log(this.contents);
      },
      error: (error) => {
        console.log('Error occured while fetching contents:' + error);
      },
    });
  }

  confirmDeleteContent(content: any): void {
    this.contentToDelete = content;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  deleteContent() {
    if (this.contentToDelete) {
      this.cService.deleteContentById(this.contentToDelete.id);
      if (this.modalRef) {
        this.modalRef.hide();
      }
    }
  }

  cancelDeleteContent() {
    this.contentToDelete = null;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
