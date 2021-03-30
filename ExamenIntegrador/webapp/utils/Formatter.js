
jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.define([
      
   
],
    function () {
        "use strict";

        return {
            formatPrice: function(nPrice){
                let nValor= parseFloat(nPrice).toFixed(2);
                return nValor;
            },

            formatStock :  function (nStock) {
                parseInt(nStock);
                let oStock = this.getView().byId("stock")
                if (nStock>=1) {
                    oStock.setText("In Stock")  ;
                    return oStock.getText();
                         
                }else{
                 oStock.setText("Out of Stock")  ;
                    return oStock.getText();  
            }
        },
           

        
        
           
        }



        
    }, true);