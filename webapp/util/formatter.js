sap.ui.define([
    'sap/ui/core/format/NumberFormat'
], function(NumberFormat) {
    
    return{
        formatCurrency:function(amount,currency){
            var oCurrencyFormat = NumberFormat.getCurrencyInstance();

            return oCurrencyFormat.format(amount,currency); 
        }
    }    
});