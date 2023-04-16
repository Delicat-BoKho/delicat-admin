import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentNewComponent } from './content-new.component';

describe('ContentNewComponent', () => {
  let component: ContentNewComponent;
  let fixture: ComponentFixture<ContentNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
