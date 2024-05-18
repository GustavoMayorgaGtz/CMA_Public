import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureLinearGraphComponent } from './configure-linear-graph.component';

describe('ConfigureLinearGraphComponent', () => {
  let component: ConfigureLinearGraphComponent;
  let fixture: ComponentFixture<ConfigureLinearGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureLinearGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureLinearGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
