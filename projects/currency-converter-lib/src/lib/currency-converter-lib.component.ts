import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CurrencyConverterLibService } from './currency-converter-lib.service';
import { FormBuilder, FormControl, FormGroup,  FormGroupDirective,  NgForm,  Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched ));
  }
}

const apiKey = 'f66cbdbee9d8de446cfe3067';

@Component({
  selector: 'lib-currency-converter-lib',
  templateUrl: './currency-converter-lib.component.html',
  styleUrls: [ './currency-converter-lib.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'converter',
  },
})


export class CurrencyConverterLibComponent implements OnInit {
  currencyConverterGroup!: FormGroup;
  currencyList: any;
  isInverted: boolean = false;
  conversionRates!: string[];
  conversionResult!: number;
  conversionResultOne!: number;
  sourceCur = 'UAH';
  targetCur = 'USD';
  amount = 1;
  sourceFilteredOptions?: string[];
  targetFilteredOptions?: string[];
  requestURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${this.sourceCur}`;
  requestRateURL = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${this.sourceCur}/${this.targetCur}/${this.amount}`;
  matcher = new MyErrorStateMatcher();

  public constructor(private fb: FormBuilder, public currencyConverterLibService: CurrencyConverterLibService) {}

  ngOnInit() {
    this.currencyConverterGroup = this.fb.group({
      amountControl: this.fb.control(1, [Validators.required, Validators.pattern(/^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/)]),
      sourceCurrencyControl: this.fb.control('UAH'),
      targetCurrencyControl: this.fb.control('USD')
    });

    this.getCurrencyData(this.requestURL);
    this.convertIt();

    this.currencyConverterGroup.controls['amountControl'].valueChanges.subscribe(() => {
      this.convertIt();
    });

    this.currencyConverterGroup.controls['sourceCurrencyControl'].valueChanges.subscribe(value => {
      this.sourceFilteredOptions = this._filter(value);
    });
    this.currencyConverterGroup.controls['targetCurrencyControl'].valueChanges.subscribe(value => this.targetFilteredOptions = this._filter(value));
  }

  _filter(val: string) {
    return Object.keys(this.conversionRates).filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  getCurrencyData(url: string) {
    this.currencyConverterLibService.getCurrencyRate(url).subscribe((result: any) => {
      this.conversionRates = result.conversion_rates;
    });
  }

  getAmountRate(source: string, target: string, amount: number) {
    const requestRateURL = this.isInverted ? `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${target}/${source}/${amount}` : `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${source}/${target}/${amount}`;
    const requestRateURLOne = this.isInverted ? `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${target}/${source}/1` : `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${source}/${target}/1`;
    this.currencyConverterLibService.getCurrencyRate(requestRateURL).subscribe((result: any) => {
      this.conversionResult = result.conversion_result;
    });
    this.currencyConverterLibService.getCurrencyRate(requestRateURLOne).subscribe((result: any) => {
      this.conversionResultOne = result.conversion_result;
    });
  }

  invertCurrencies() {
    this.isInverted = !this.isInverted;
    this.convertIt();
  }

  convertIt() {
    this.getAmountRate(this.currencyConverterGroup.controls['sourceCurrencyControl'].value, this.currencyConverterGroup.controls['targetCurrencyControl'].value, this.currencyConverterGroup.controls['amountControl'].value);
  }

  setInitialValue() {
    const field = this.currencyConverterGroup.controls['amountControl'];
    if (!field.value) {
      field.setValue(1);
    }
  }

}
