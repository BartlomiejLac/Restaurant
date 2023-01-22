import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishCreationComponentComponent } from './dish-creation-component.component';

describe('DishCreationComponentComponent', () => {
  let component: DishCreationComponentComponent;
  let fixture: ComponentFixture<DishCreationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishCreationComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishCreationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
