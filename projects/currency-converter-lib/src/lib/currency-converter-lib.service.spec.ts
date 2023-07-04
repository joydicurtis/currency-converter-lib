import { TestBed } from '@angular/core/testing';

import { CurrencyConverterLibService } from './currency-converter-lib.service';

describe('CurrencyConverterLibService', () => {
  let service: CurrencyConverterLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyConverterLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
