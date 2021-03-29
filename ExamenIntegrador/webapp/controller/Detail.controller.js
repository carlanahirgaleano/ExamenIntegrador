sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "ExamenIntegrador/ExamenIntegrador/utils/Constants",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "ExamenIntegrador/ExamenIntegrador/utils/Formatter"
        
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Constants, MessageToast, MessageBox , Formatter ) {
		"use strict";

		return Controller.extend("ExamenIntegrador.ExamenIntegrador.controller.Detail", {
            Format: Formatter,
			onInit: function () {
             

            },
            onOpenDialog: function () {
                if (!this._oFragment) {
                    this._oFragment = sap.ui.xmlfragment(Constants.ids.editDialog, Constants.routes.DIALOGS.editDialog , this);
                    this.getView().addDependent(this._oFragment);
                }
                this._oFragment.open();
            },
            onCloseDialog: function(){
                this._oFragment.close();
            },
            onDelete: function (){
                MessageBox.confirm("Desea borrar?")
            },
            onCopy: function (){
                MessageToast.show("Copiado en el portapapeles")
            }

            
		});
	});