import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolCreatorComponent } from './tool-creator.component';

describe('ToolCreatorComponent', () => {
  let component: ToolCreatorComponent;
  let fixture: ComponentFixture<ToolCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
