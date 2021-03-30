sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "ExamenIntegrador/ExamenIntegrador/utils/Services",
         "ExamenIntegrador/ExamenIntegrador/utils/Constants",
         "sap/ui/Device",
         "sap/ui/model/Filter",
         "sap/ui/model/FilterOperator",
         "sap/ui/model/Sorter",
        "ExamenIntegrador/ExamenIntegrador/utils/Formatter",
        "sap/m/library"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel, Services, Constants, Device, Filter, FilterOperator,Sorter, Formatter, mLibrary) {
		"use strict";

		return Controller.extend("ExamenIntegrador.ExamenIntegrador.controller.Master", {
            Format: Formatter,
			onInit: function () {
                this.loadModelProductos();
                this.loadModelSupplier(1)
                this.loadModelCategory(1)

                sap.ui.getCore().getConfiguration().setLanguage("ES");
                     this.mGroupFunctions = {
                   
                  ProductName: function (oContext) {
                        var ProductName = oContext.getProperty("ProductName");
                        return {
                            key: ProductName,
                            text: ProductName
                        };
                    },
                    UnitPrice: function (oContext) {
                        var unitPrice = oContext.getProperty("UnitPrice");
                        return {
                            key: unitPrice,
                            text: unitPrice
                        };
                    }
                     
                   };
                this._mViewSettingsDialogs={};
                 this.getOwnerComponent().getRouter().getRoute(Constants.routes.VIEWS.routeMaster).attachPatternMatched(this._onRoutedMatched, this);

            },
             _onRoutedMatched: function (oEvent){
               this.getOwnerComponent().getRouter().navTo(Constants.routes.VIEWS.routeDetail);
                
             },
            loadModelProductos: async function (){
                let oResponse = await Services.getProductos();
                let oData= oResponse[0];
                let oModel = new JSONModel (oData);
                this.getOwnerComponent().setModel(oModel, Constants.names.MODELS.modelProductos)

                let oCantidadProductos= oModel.getData();
                oCantidadProductos= oCantidadProductos.value.length;
                let oModelCantidad = new JSONModel();
                oModelCantidad.setData(oCantidadProductos)               
                this.getOwnerComponent().setModel(oModelCantidad, Constants.names.MODELS.listaProductos);

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
                this.getOwnerComponent().getRouter().navTo(Constants.routes.VIEWS.routeDetail)

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
                oBindingInfo.filter(oFilters, "Application")
                
                let cantidadProductos= oList.getItems().length;
            
                let oModelCantidad = new JSONModel();
                oModelCantidad.setData(cantidadProductos)
               
                this.getOwnerComponent().setModel(oModelCantidad, Constants.names.MODELS.listaProductos);
              },
              onSort: function(){
               this.createViewSettingsDialog("ExamenIntegrador.ExamenIntegrador.fragments.SortDialog").open();        

               
            },
            onFilter: function(){
                 this.createViewSettingsDialog("ExamenIntegrador.ExamenIntegrador.fragments.FiltersDialog").open();
            },
             onSortDialogConfirm: function (oEvent) {
                var oList = this.getView().byId("listProducts"),
                    mParams = oEvent.getParameters(),
                    oBinding = oList.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            onFilterDialogConfirm: function (oEvent) {
                var oList = this.byId("listProducts"),
                    mParams = oEvent.getParameters(),
                    oBinding = oList.getBinding("items"),
                    aFilters = [];
                mParams.filterItems.forEach(function (oItem) {
                    var sPath = oItem.getKey(),
                        sOperator = FilterOperator.Contains,
                        sValue1 = oItem.getText();
                    var oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });
                oBinding.filter(aFilters);
            },
             createViewSettingsDialog:function(sDialogFragmentName){
             var oDialog;
             oDialog= this._mViewSettingsDialogs[sDialogFragmentName]
            
             //pregunto si ODialog existe en la variable global y si no existe la crea y la agrega
             if(!oDialog){
             oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);   
             this._mViewSettingsDialogs[sDialogFragmentName]= oDialog                 
            this.getView().addDependent(oDialog);
             }
            oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);
            if (sDialogFragmentName === "ExamenIntegrador.ExamenIntegrador.fragments.FiltersDialog") {
                var oModelJSON = this.getOwnerComponent().getModel(Constants.names.MODELS.modelProductos);
                var modelOriginal = oModelJSON.getProperty("/value");

                var jsonNombreProducto = JSON.parse(JSON.stringify(modelOriginal, ["ProductName"]));
                var jsonPrice = JSON.parse(JSON.stringify(modelOriginal, ["UnitPrice"]));
                
                    oDialog.setModel(oModelJSON);
           

                      //check for duplicates in filter items
                        jsonNombreProducto = jsonNombreProducto.filter(function (currentObject) {
                            if (currentObject.ProductName in jsonNombreProducto) {
                                return false;
                            } else {
                                jsonNombreProducto[currentObject.ProductName] = true;
                                return true;
                            }
                        });
                        jsonPrice = jsonPrice.filter(function (currentObject) {
                            if (currentObject.UnitPrice in jsonPrice) {
                                return false;
                            } else {
                                jsonPrice[currentObject.UnitPrice] = true;
                                return true;
                            }
                        
                        });    
                    
                          //create items arrays and iterate
                        var nombreFilter = [];
                        for (var i = 0; i < jsonNombreProducto.length; i++) {
                            nombreFilter.push(
                                new sap.m.ViewSettingsItem({
                                    text: jsonNombreProducto[i].ProductName,
                                    key: "ProductName"
                                })
                            );
                        }
                         var priceFilter = [];
                        for (var i = 0; i < jsonPrice.length; i++) {
                            priceFilter.push(
                                new sap.m.ViewSettingsItem({
                                    text: jsonPrice[i].UnitPrice,
                                    key: "UnitPrice"
                                })
                            )
                        }
                         
                          //set filter items and labels
                        oDialog.destroyFilterItems();
                        oDialog.addFilterItem
                        (new sap.m.ViewSettingsFilterItem({
                            key: "ProductName",
                            text: "ProductName",
                            items: nombreFilter
                        }));
                        oDialog.addFilterItem(
                            new sap.m.ViewSettingsFilterItem({
                            key: "UnitPrice",
                            text: "UnitPrice",
                            items: priceFilter
                        }));
                     
            if (Device.system.desktop) {
                  oDialog.addStyleClass("sapUiSizeCompact");
                        }
                    
                        return oDialog;
            }
              
         
    }
		});
	});