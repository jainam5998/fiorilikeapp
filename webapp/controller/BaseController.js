sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'emc/hr/payroll/util/formatter'
], function(Controller,Formatter) {
    'use strict';
    return Controller.extend("emc.hr.payroll.controller.BaseController",{
        formatter:Formatter,
        extractPath:function(oEvent)
        {
            var sArgument=oEvent.getParameter("arguments").fruitId
            return '/fruits/'+sArgument;
        },
        readMessage:function(key,parm1){
            var oResourceModel=this.getOwnerComponent().getModel("i18n");
            var oResourceBundle=oResourceModel.getResourceBundle();
            return oResourceBundle.getText(key,parm1);


        }
    })
    
});