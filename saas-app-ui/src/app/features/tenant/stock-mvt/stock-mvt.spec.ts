import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMvt } from './stock-mvt';

describe('StockMvt', () => {
  let component: StockMvt;
  let fixture: ComponentFixture<StockMvt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMvt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockMvt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
