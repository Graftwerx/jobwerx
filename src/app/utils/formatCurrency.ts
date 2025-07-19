export function formatCurrency(amount:number){
    return new Intl.NumberFormat("en-GB", {
          style: 'currency',
          currency: 'GBP',
          maximumFractionDigits:0,

    }).format(amount)
}