import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStockMvt } from './manage-stock-mvt';

describe('ManageStockMvt', () => {
  let component: ManageStockMvt;
  let fixture: ComponentFixture<ManageStockMvt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStockMvt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStockMvt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
