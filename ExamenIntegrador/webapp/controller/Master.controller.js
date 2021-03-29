sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "ExamenIntegrador/ExamenIntegrador/utils/Services",
         "ExamenIntegrador/ExamenIntegrador/utils/Constants",
         "sap/ui/Device",
         "sap/ui/model/Filter",
         "sap/ui/model/FilterOperator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel, Services, Constants, Device, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("ExamenIntegrador.ExamenIntegrador.controller.Master", {
			onInit: function () {
                this.loadModelProductos();
                 this.getOwnerComponent().getRouter().getRoute("RouteMaster").attachPatternMatched(this._onRoutedMatched, this);

            },
             _onRoutedMatched: function (oEvent){
                           this.getOwnerComponent().getRouter().navTo("RouteDetail");
                
             },
            loadModelProductos: async function (){
                let oResponse = await Services.getProductos();
                let oData= oResponse[0];
                let oModel = new JSONModel (oData);
                this.getOwnerComponent().setModel(oModel, Constants.names.MODELS.modelProductos)
                if(!Device.system.phone){                    
                 var oProdSeleccionado= oModel.getProperty("/value/0");
                var oModelProducto= new JSONModel(oProdSeleccionado);
                this.getOwnerComponent().setModel(oModelProducto , Constants.names.MODELS.modelSeleccion)
                 }
                
              },
              loadModelSupplier: async function(productId){
                  let oResponse = await Services.getSupplier(productId);
                const oData = oResponse[0]
                var oModel= new JSONModel();
                      
                oModel.setData(oData);
                this.getOwnerComponent().setModel(oModel, Constants.names.MODELS.modelProductID)

              },
                 loadModelCategory: async function(productId){
                  let oResponse = await Services.getCategory(productId);
                const oData = oResponse[0]
                var oModel= new JSONModel();
                      
                oModel.setData(oData);
                this.getOwnerComponent().setModel(oModel, Constants.names.MODELS.modelCategory)

              },
              onListItemPress : function(oEvent){
                var sProductId = oEvent.getSource().getSelectedItem().getBindingContext(Constants.names.MODELS.modelProductos).getPath();
                var oModel = this.getOwnerComponent().getModel(Constants.names.MODELS.modelProductos);
                var oProductoSeleccionado = oModel.getProperty(sProductId);

                var oModelSeleccion = new JSONModel(oProductoSeleccionado);

                this.getOwnerComponent().setModel(oModelSeleccion, Constants.names.MODELS.modelSeleccion);
                var oProductID= oModelSeleccion.getProperty("/ProductID")
                this.loadModelSupplier(oProductID)
                this.loadModelCategory(oProductID)
                this.getOwnerComponent().getRouter().navTo("RouteDetail")

              },
              onSearch: function(oEvent){
                var sQuery = oEvent.getSource().getValue();
                var aFilters=[];
                if(sQuery && sQuery.length >0){
                    let oFilterName= new Filter("ProductName", FilterOperator.Contains, sQuery)
                    aFilters.push(oFilterName);

                    var oFilters = new Filter(aFilters)

                }
                let oList = this.getView().byId("listProducts")
                let oBindingInfo = oList.getBinding("items")
                let cantidadProductos=oBindingInfo.filter(oFilters, "Application")
                
            
                let oModel = new JSONModel(cantidadProductos);
                console.log(oModel.getProperty("/oData/aIndices"))
                this.getOwnerComponent().setModel(oModel, Constants.names.MODELS.listaProductos);
              }
		});
	});