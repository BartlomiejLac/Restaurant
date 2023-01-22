import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishCloseComponent } from './dish-close.component';

describe('DishCloseComponent', () => {
  let component: DishCloseComponent;
  let fixture: ComponentFixture<DishCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishCloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
