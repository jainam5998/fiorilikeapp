sap.ui.define([
    'emc/hr/payroll/controller/BaseController',
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageStrip",
    "sap/m/MessageToast"
], function(Controller,Fragment,Filter,FilterOperator,MessageBox,MessageStrip,MessageToast) {
    'use strict';
    return Controller.extend("emc.hr.payroll.controller.View2",{
        onInit: function(){
                //Get the Router Object
                this.oRouter=this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("detail").attachPatternMatched(this.herculis,this);
        },
        handleConfirm:function(status){
            
                if(status === "OK"){
                    MessageToast.show(this.readMessage("XMSG_ORDRL","9999"));
                }
                else{
                    MessageToast.show("Order Cancelled");
                }
        },
        onCancel:function()
        {
            this.oRouter.navTo("master");
        },
        onOrder:function()
        {  
            MessageBox.confirm(this.readMessage("XMSG_CONFIRM"),{
                title:'Confirmation',
                onClose:this.handleConfirm.bind(this)
            })

        },
        onLinkPress:function(oEvent)
        {
            var sText=oEvent.getSource().getText();
            sText="https://google.com?q="+sText;
            window.open(sText);
        },
        oCityPopup:null,
        oSupplierPopup:null,
        onFilter:function(){
            //alert("yayyy  Toolbar filter is working");
            if(!this.oSupplierPopup){
                var that=this;
                    Fragment.load(
                    {
                        name:"emc.hr.payroll.fragments.popup",
                        type:"XML",
                        controller:this,
                        id:"supplier"
                    }).then(function(oSupplier){
                        that.oSupplierPopup=oSupplier;
                        that.getView().addDependent(that.oSupplierPopup);
                        that.oSupplierPopup.bindAggregation("items",{
                            path:'/supplier',
                            template:new sap.m.DisplayListItem({
                                label:'{name}',
                                value:'{city}'
                            })
                        })
                        that.oSupplierPopup.open();
                        that.oSupplierPopup.setTitle("Select Supplier");
                    })
            }
            else{
                this.oSupplierPopup.open()
            }
           
        },
        onSearch:function(oEvent)
        {
            //Get the Search String
            var sValue=oEvent.getParameter("value");
            //Get the binding items but in search event we have a parameter which return items binding so we will use that.
            var oBinding=oEvent.getParameter("itemsBinding");
            //Prepare Filter
            var oFilter=new Filter('name',FilterOperator.Contains,sValue);
            //Pass filter to popup items binding
            oBinding.filter(oFilter);

        },
        onConfirm:function(oEvent){
            var sId=oEvent.getSource().getId();
            if(sId.indexOf("city")!==-1){
                    //Read the item which was selected in the pop up
                    var oSelectedItem=oEvent.getParameter("selectedItem");
                    //Retrive the label from the oSelectedItem
                    var sText=oSelectedItem.getLabel();
                    //Set the value inside the field in the label by seting the field object received from the f4 help
                        this.selectedField.setValue(sText);
            }
            else{
                //Get the Table object
                var oTable=this.getView().byId("idTable");
                //read multiple select items
                var oSelItems=oEvent.getParameter("selectedItems");
                //Construct filter
                var aFilter=[];
                for(let i=0;i<oSelItems.length;i++){
                    var eachItem=oSelItems[i];
                    var sText=eachItem.getLabel();
                    aFilter.push(new Filter('name',FilterOperator.EQ,sText));   
                }
                var MasterFilter=new Filter({
                    filters: aFilter,
                    and:false
                })
                //Pump the finding
                oTable.getBinding("items").filter(MasterFilter);
            }
            
        },
        //Creating local variable to store the Selected field 
        selectedField:null,
        onF4Help:function(oEvent){
           // alert("yayyy  F4 help is working");
           //Copying the object of Selected field by oEvent.getSource();
           this.selectedField=oEvent.getSource();
                    if(!this.oCityPopup){
                        var that=this;//local variable as this cannot be used inside asynchronous function as this is not accessed directly in it
                                Fragment.load({
                                name:"emc.hr.payroll.fragments.popup",
                                type:"XML",
                                controller:this,//Controller access is provided to popup fragment
                                id:"city"
                            }).then(function(oCity){  //.then(promise) Asynchronous call back function and promise
                                that.oCityPopup=oCity;
                                //Providing access of the immune system to parasite using WBC(who already have access to resources such as model)
                                that.getView().addDependent(that.oCityPopup);
                                that.oCityPopup.bindAggregation("items",{
                                    path:'/cities',
                                    template:new sap.m.DisplayListItem({
                                        label:'{name}',
                                        value:'{famousFor}'
                                    })
                                })
                                //As we dont want multiselect for city field and we are using common fragment . so setting multi select false for particular fragment object
                                that.oCityPopup.setMultiSelect(false);
                                that.oCityPopup.setRememberSelections(false);
                                that.oCityPopup.setTitle("Select City");
                                that.oCityPopup.open();
                            })
                    }
                    else{
                        this.oCityPopup.open()
                    }
           },
        herculis:function(oEvent)
        {
         
            //Step 1:Now Called from BaseController.js
            // var sArgument=oEvent.getParameter("arguments").fruitId
            //Step 2:Before BaseController
            // var sPath='/fruits/'+sArgument;
            //extract Path Method from BaseController and getting its object so we get the value of retuen i.e sPAth
            var sPath= this.extractPath(oEvent); 
            this.getView().bindElement(sPath);
        },
        onBack:function(){
            // //Get The Parent Control Object. Container for our view
            // var oAppCon=this.getView().getParent();
            // // //Ask Parent to move to View2
            // oAppCon.to("idView1");

            //Using Chaining
           //Corrected this.getView().getParent().to("idView1");
           this.oRouter.navTo("master");
        }
    });
});