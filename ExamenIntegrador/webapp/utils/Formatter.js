
jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.define([
      
   
],
    function () {
        "use strict";

        return {
            formatStock :  function (nStock) {
                let oStock = this.getView().byId("stock")
                if (nStock>=1) {
                    oStock.setText("In Stock")  ;
                    return oStock.getText();
                         
                } else {
                oStock.setText("Out in Stock")  ;
                    return oStock.getText();  
            }
        },
            formatStockColor :  function (nStock) {
                let oStock = this.getView().byId("stock")
                if (nStock>=1) {
                     oStock.setState("Succes")
                    return oStock.getState();                
                
                } else {
                    oStock.setState("Error")
                    return oStock.getState();                 
            }  


        
        },
           
        }



        
    }, true);