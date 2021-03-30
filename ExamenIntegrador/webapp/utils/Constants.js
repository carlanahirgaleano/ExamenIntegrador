sap.ui.define([
	],	
	function (Controller) {
		"use strict";
        return{
            ids:{
                editDialog: "editDialog"

            },
            names:{
                FRAGMENTS:{
                  
                },
                MODELS:{
                       modelProductos : "modelProductos" ,
                       modelSeleccion: "modelSeleccion",
                       listaProductos: "listaProductos",
                       modelProductID: "modelProductID",
                       modelCategory: "modelCategoria"
                }
            },
          
            routes:{
                DIALOGS:{
                editDialog: "ExamenIntegrador.ExamenIntegrador.fragments.EditDialog",
                },
                ENTITYS:{
                    products :"/V3/Northwind/Northwind.svc/Products"  
                },
                VIEWS:{
                    routeDetail : "RouteDetail",
                    routeMaster: "RouteMaster"
                }
            }

        }
		
	},true);