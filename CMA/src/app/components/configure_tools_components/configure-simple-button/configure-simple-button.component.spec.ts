import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSimpleButtonComponent } from './configure-simple-button.component';

describe('ConfigureSimpleButtonComponent', () => {
  let component: ConfigureSimpleButtonComponent;
  let fixture: ComponentFixture<ConfigureSimpleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureSimpleButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureSimpleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
