import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTextInputComponent } from './simple-text-input.component';

describe('SimpleTextInputComponent', () => {
  let component: SimpleTextInputComponent;
  let fixture: ComponentFixture<SimpleTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTextInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
