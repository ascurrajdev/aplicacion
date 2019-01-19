class Data {
  constructor() {}
  is_numeric = (n) => !isNaN(parseFloat(n)) && isFinite(Number(n)) && Number(n) == n;

  currency_format = (amount: number, coin: string = '$', d_s: string = '.', t_s: string = ',', decimalCount: number = 2) => {
    try {
      const sign = amount < 0 ? '-' : '';
      const round_count = Math.abs(decimalCount);
      let str_amount = this.truncate_decimals(Math.abs(amount), round_count).toString();

      if (decimalCount > 0 && str_amount.lastIndexOf('.') !== -1) {
          const matches = /\.([\d]+)$/gi.exec(str_amount);
          if (Array.isArray(matches) && matches.length === 2) {
              const str_decimals = matches[1];
              const str_decimals_length = str_decimals.length;
              if (str_decimals_length < decimalCount) {
                  str_amount += Array(decimalCount - str_decimals_length).fill('0').join('');
              }
          }
      }

      const p_int = /^\./.test(str_amount) ? '0' : str_amount.replace(/\.\d+$/g, '');
      let p_dec = round_count && str_amount.indexOf('.') !== -1 ? str_amount.replace(/^\d+\./g, '') : '';
      if (round_count && p_dec === '') { p_dec = Array(round_count).fill(0).join(''); }

      const j = p_int.length > 3 ? (p_int.length % 3) : 0;

      let res: string = sign.concat(j ? p_int.substr(0, j).concat(t_s) : '');
      res += p_int.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t_s);
      res += (p_dec !== '' ? d_s.concat(p_dec) : '');
      return coin.concat(' ', res);
    } catch (e) {
      console.log('Error: ', e);
      return coin.concat(' ');
    }
  }

  truncate_decimals(n: number, d = 2, r = false) {
    return r ? Number(n.toFixed(d)) : (Math.trunc(n * Math.pow(10, d)) / Math.pow(10, d));
  }
}

export default new Data();
