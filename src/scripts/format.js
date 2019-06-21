const format = {};

format.getOptions = (currency) => {
  return {
    style: 'currency',
    maximumFractionDigits: 2,
    currency,
  }
}

format.returnFormatted = (currency, number) => {
  return new Intl.NumberFormat(currency, format.getOptions(currency)).format(number); 
}

export default format;