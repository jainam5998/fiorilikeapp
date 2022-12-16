sap.ui.define([
    'emc/hr/payroll/controller/BaseController',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller,Filter,FilterOperator) {
    'use strict';
    return Controller.extend("emc.hr.payroll.controller.View1",{
        onInit: function()
            {
                    //ROuter is readily available with Component.js Base class UIComponent
                    this.Router=this.getOwnerComponent().getRouter();
                    this.Router.getRoute("detail").attachPatternMatched(this.herculis,this);
            },
        herculis:function(oEvent)
            {   
                //Step 1:Now Called from BaseController.js
               // var sArgument=oEvent.getParameter("arguments").fruitId
               //Step 2:Before BaseController
               // var sPath='/fruits/'+sArgument;
               //extract Path Method from BaseController and getting its object so we get the value of retuen i.e sPAth
               var sPath= this.extractPath(oEvent); 
               var oList=this.getView().byId("idLST");
                
                for(var i=0;i<oList.getItems().length;i++){
                var element=oList.getItems()[i];
                    if(element.getBindingContextPath()=== sPath){
                    oList.setSelectedItem(element);
                    break;
                    }
                }   
                
            },
        onNext:function()
        {
            //Get The Parent Control Object. Container for our view
            var oAppCon=this.getView().getParent();
            //Ask Parent to move to View2
            oAppCon.to("idView2")
        },
        onItemClick:function(){
            //this- is our class object, Which is in this case our controller
            this.onNext();
        },
        onSearch:function(oEvent){
            //Step 1: Get the text/query user has typed for search
            var sSearch= oEvent.getParameter("query");
            if(sSearch === "" || sSearch == undefined){
                sSearch= oEvent.getParameter("newValue");
            }
            //Step 2: Construct the filter object with operand and operator 
            var oFilter=new Filter("name",FilterOperator.Contains,sSearch);
            var oFilter2=new Filter("taste",FilterOperator.Contains,sSearch);
            var aFilter=[oFilter,oFilter2]  //Add the Filter in Array 

            //TO declare the filter to work as OR operator not and

            var oMaster=new Filter({
                filters:aFilter,
                and:false
            });

            //Step 3: Get the List Object
            var oList= this.getView().byId("idLST");
            //Step 4: Inject the filter to the List
            oList.getBinding("items").filter(oMaster);
        },
        onNavNext:function(){
            this.onNext();
        },
        onDelete:function(oEvent)
        {
            var sSelected=oEvent.getParameter("listItem");
            var oList=oEvent.getSource()
            oList.removeItem(sSelected);
        },
        onDeleteSelected:function(oEvent){
           var oList=this.getView().byId("idLST");
           var sSelected=oList.getSelectedItems();
           sSelected.forEach(item=>{
            oList.removeItem(item);
           });
        },
        onFruitSelect:function(oEvent){
            //Step1: Get the router Object(already got this.Router by calling it globally in the onInit Function)
            //Step 2: Trigger the ROute(navTo is method in Router class)
        
            var oSelectedItem=oEvent.getParameter("listItem"); 
            this.Router.navTo("detail",{
                fruitId:oSelectedItem.getBindingContextPath().split('/')[2]
            });
        }
    });
});