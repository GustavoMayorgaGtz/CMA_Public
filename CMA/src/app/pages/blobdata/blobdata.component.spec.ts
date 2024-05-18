import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlobdataComponent } from './blobdata.component';

describe('BlobdataComponent', () => {
  let component: BlobdataComponent;
  let fixture: ComponentFixture<BlobdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlobdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlobdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
