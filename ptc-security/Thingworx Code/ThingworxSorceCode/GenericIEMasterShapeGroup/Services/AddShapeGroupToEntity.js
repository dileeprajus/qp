try{
    var reuslt ={};
    var shape_groups_arr = ["GenericIEMasterShapeGroup"];
    var thing_names_arr = ["FlexConfig","RestConfig","SoapConfig","StaticFileConfig","MappingConfig","TypeManagerConfig"];
    var template_names_arr = ["SourceGroup","TargetGroup","MappingGroup"];
    for(var k=0;k<template_names_arr.length;k++){
    	for(var i=0;i<shape_groups_arr.length;i++){
            //Add required shapeGroups to newly created Group
            var params = {
                name: template_names_arr[k] /* THINGTEMPLATENAME */,
                thingShapeName: shape_groups_arr[i] /* THINGSHAPENAME */
            };

            // no return
            Resources["EntityServices"].AddShapeToThingTemplate(params);
        }
    }
    for(var k=0;k<thing_names_arr.length;k++){
    	for(var i=0;i<shape_groups_arr.length;i++){
            //Add required shapeGroups to newly created Group
            var params = {
                name: thing_names_arr[k] /* THINGNAME */,
                thingShapeName: shape_groups_arr[i] /* THINGSHAPENAME */
            };

            // no return
            Resources["EntityServices"].AddShapeToThing(params);
        }
    }
    var result={"Success":"Added shapes successfully"};
    
}
catch(e){
    var result={"Exception":e};

}