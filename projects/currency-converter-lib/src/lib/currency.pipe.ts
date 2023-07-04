import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number): unknown {
    return value.toLocaleString('en-US', {style: 'currency', currency: 'USD',});
  }
}
