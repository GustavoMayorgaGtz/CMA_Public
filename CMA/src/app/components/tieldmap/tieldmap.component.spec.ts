import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieldmapComponent } from './tieldmap.component';

describe('TieldmapComponent', () => {
  let component: TieldmapComponent;
  let fixture: ComponentFixture<TieldmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TieldmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieldmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
