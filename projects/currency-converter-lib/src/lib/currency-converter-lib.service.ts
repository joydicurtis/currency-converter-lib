import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { CurrencyConverterLibModule } from './currency-converter-lib.module';

type Rates = {
  [currency: string]: number;
}

type CurrencyData = {
  base_code: string;
  conversion_rates: Rates;
  documentation: string;
  result: string;
  terms_of_use: string;
  time_last_update_unix: any;
  time_last_update_utc: string;
  time_next_update_unix: any;
  time_next_update_utc: string
}

@Injectable({
  providedIn: CurrencyConverterLibModule
})

export class CurrencyConverterLibService {

  constructor(protected httpService: HttpClient) { }

  getCurrencyRate(url: string): Observable<any> {
    return this.httpService.get(url);
  }
}
