//INPUTS: Nothing
//OUTPUTS: JSON
try{
    var arr = [];
   // var temp_type = input.groupType; //source or target or mapping(datahandler)
   // var temp_tags = "Applications:IE;Applications:DynamicGroup;Applications:Mapping" ;// for mapping group
    var temp_tags = "Applications:IE;Applications:DynamicGroup"
//    if(temp_type==="source"){
//        temp_tags = "Applications:IE;Applications:DynamicGroup;Applications:Source"
//    } else if(temp_type==="target"){
//    	temp_tags = "Applications:IE;Applications:DynamicGroup;Applications:Target";
//    } else if(temp_type==="mapping"){
//    	var temp_tags = "Applications:IE;Applications:DynamicGroup;Applications:Mapping" ;// for mapping group
//    } else {
//    }
     var data_source = me.GroupDataSourceType; //Get the GroupDataSourceType property which contains template type either flex or rest or static or soap or mapping
    var params = {
        maxItems: 500 /* NUMBER */,
        nameMask: undefined /* STRING */,
        type: "ThingTemplate" /* STRING */,
        tags: temp_tags /* TAGS */
    };

    // result: INFOTABLE dataShape: RootEntityList
    var result_table = Resources["EntityServices"].GetEntityList(params);
    result_table = result_table.ToJSON();
    for(var i=0;i<result_table.rows.length;i++){
        var obj= {};
        obj["Name"] = result_table.rows[i].name;
        obj["Description"] = result_table.rows[i].description;
        obj["configsCount"] = ThingTemplates[result_table.rows[i].name].GetImplementingThings().getRowCount(); // get the count of configs that implements the current group
        if (data_source[result_table.rows[i].name]) {
            obj["dataSourceType"] = data_source[result_table.rows[i].name]["dataSourceType"];
            obj["isActive"] = data_source[result_table.rows[i].name]["isActive"];
           	obj["tenantID"] = data_source[result_table.rows[i].name]["tenantID"] ? data_source[result_table.rows[i].name]["tenantID"] : "";
        
//            if(obj["dataSourceType"]===""){
//                obj["selectedSourceGroup"] = data_source[result_table.rows[i].name]["selectedSourceGroup"];
//                obj["selectedTargetGroup"] = data_source[result_table.rows[i].name]["selectedTargetGroup"];
//                var sourceTemp = data_source[result_table.rows[i].name]["selectedSourceGroup"];
//                var targetTemp = data_source[result_table.rows[i].name]["selectedTargetGroup"];
//                obj["selectedSourceType"] = data_source[sourceTemp]["dataSourceType"];
//                obj["selectedTargetType"] = data_source[targetTemp]["dataSourceType"];
//            }            
            if(!obj["isActive"]){
                arr.push(obj); //push only if group name and details in templateDatasourceCategory property
            }
        }
        //arr.push(obj);
    }
    var result = {"Groups":arr};
    logger.warn("Result for GetAllTArchivedGroups is: "+result);
}
catch(e){
    var result = {"Templates":[]};
    logger.warn("Exception in GetAllTArchivedGroups service of type is :"+e);
}