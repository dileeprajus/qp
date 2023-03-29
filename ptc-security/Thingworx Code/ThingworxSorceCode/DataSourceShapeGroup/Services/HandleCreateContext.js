//INPUTS: MCC(JSON), CC(JSON),TransfromedObject(JSON)
//OUTPUT : result(JSON)
var result = "";
try{
    function getRecordsFromCreateContext(context){
        var values = Things["CreateContextDataTable"].CreateValues();
        values.source_group_name = context.source_group_name;
        values.source_config_name = context.source_config_name;
        values.target_group_name = context.target_group_name;
        values.target_config_name = context.target_config_name;
        values.mapping_group_name = context.mapping_group_name;
        values.mapping_config_name = context.mapping_config_name;
        values.primary_key_at_dataprovider = context.primary_key_at_dataprovider;

        var params = {
            values: values /* INFOTABLE*/
        };
        // result: INFOTABLE dataShape: "undefined"
        var entries = Things["CreateContextDataTable"].QueryDataTableEntries(params);
        return entries;
    }

    function updateTargetPersistantObjectByID(target_persistant_objet_id,TransformedObject,context){
        //****************Target persistant object search query using id******************
        var values = Things[context.target_config_name].CreateValues();
        values.id = target_persistant_objet_id;
        var params = {
            values: values /* INFOTABLE*/
        };
        // result: INFOTABLE dataShape: "undefined"
        var target_entries = Things[context.target_config_name].QueryDataTableEntries(params);
        if(target_entries.length===1){
            var old_obj = target_entries[0].raw_data;
            logger.warn("Existing Data in Target :"+JSON.stringify(old_obj));
            var new_obj = {
            };
            //Merging existing object with new one
            //            for(var key in old_obj) new_obj[key] = old_obj[key];
            //            for(var key in TransformedObject) new_obj[key] = TransformedObject[key];
            //get the json merge result from JsonsMerger service by passing old_obj and TransfomedObject as inputs to it
            var jsonsMergeParams = {
                json1: old_obj /* JSON */,
                json2: TransformedObject /* JSON */
            };

            // result: JSON
            new_obj = me.JsonsMerger(jsonsMergeParams);
            logger.warn("Updated Data in Target :"+JSON.stringify(new_obj));
            //**************updating target persistant object
            var values = Things[context.target_config_name].CreateValues();
            values.id = target_persistant_objet_id;
            //STRING [Primary Key]
            values.raw_data = new_obj;
            values.converted_data = JSON.stringify(new_obj);
            var params = {
                sourceType: undefined /* STRING */,
                values: values /* INFOTABLE*/,
                location: undefined /* LOCATION */,
                source: undefined /* STRING */,
                tags: undefined /* TAGS */
            };
            Things[context.target_config_name].UpdateDataTableEntry(params);
        }
    }

    function CreateNewCreateContext(CC,target_persistant_objet_id){
        var values = Things["CreateContextDataTable"].CreateValues();

        values.target_config_name = CC.target_config_name;
        //THINGNAME
        values.target_group_name = CC.target_group_name;
        //THINGTEMPLATENAME
        //values.updated_at_dataprovider = CC.updated_at_dataprovider; //DATETIME
        values.mapping_group_name = CC.mapping_group_name;
        //THINGTEMPLATENAME
        values.source_group_name = CC.source_group_name;
        //THINGTEMPLATENAME
        values.primary_key_at_dataprovider = CC.primary_key_at_dataprovider;
        //STRING
        values.mapping_config_name = CC.mapping_config_name;
        //THINGNAME
        values.target_persistant_object_id = target_persistant_objet_id;
        //STRING
        values.id = new Date().getTime();
        //STRING [Primary Key]
        //values.created_at_dataprovider = CC.created_at_dataprovider; //DATETIME
        values.source_config_name = CC.source_config_name;
        //THINGNAME

        var params = {
            sourceType: undefined /* STRING */,
            values: values /* INFOTABLE*/,
            location: undefined /* LOCATION */,
            source: undefined /* STRING */,
            tags: undefined /* TAGS */
        };

        // result: STRING
        var new_cc = Things["CreateContextDataTable"].AddDataTableEntry(params);
        return new_cc;
    }

    function CreateNewTargetPersistantObject(CC,transformed_object){
        var values = Things[CC.target_config_name].CreateValues();

        values.target_config_name = CC.target_config_name;
        //THINGNAME
        values.target_group_name = CC.target_group_name;
        //THINGTEMPLATENAME
        values.id = new Date().getTime();
        values.created_at = new Date();
        values.updated_at = new Date();
        values.raw_data = transformed_object;
        values.converted_data = JSON.stringify(transformed_object);


        var params = {
            sourceType: undefined /* STRING */,
            values: values /* INFOTABLE*/,
            location: undefined /* LOCATION */,
            source: undefined /* STRING */,
            tags: undefined /* TAGS */
        };

        // result: STRING
        Things[CC.target_config_name].AddDataTableEntry(params);
        return values.id;
    }
    var TransformedObject = TransformedObject ;
    if(TransformedObject["Result"]!==undefined){
        if(TransformedObject["Result"]["schema"]!==undefined){
            TransformedObject = TransformedObject["Result"]["schema"];
        }
    }
    if(MCC===null || MCC===undefined){
        var c_entries = getRecordsFromCreateContext(CC);
        if(c_entries.length===0){//if doesn't match : Create new TargetPersistantObject and CC
            //logger.warn("CreateNewTargetPersistantObject");
            var new_target_persistant_obj_id = CreateNewTargetPersistantObject(CC,TransformedObject);
            //get the above created target id and create cc with it
            var new_cc = CreateNewCreateContext(CC,new_target_persistant_obj_id);

        }
        else{//if match TODO : first check for length is not undefined
            var target_persistant_objet_id = c_entries[0].target_persistant_object_id;
            //logger.warn("updateTargetPersistantObjectByID"+target_persistant_objet_id);
            updateTargetPersistantObjectByID(target_persistant_objet_id,TransformedObject,CC);
        }

    }
    else{
        //****************Create context search query using MCC******************
        var entries = getRecordsFromCreateContext(MCC);
        if(entries.length===0){
            //TODO : if doesn't match need to raise an exception
            //logger.warn("NO CC FOUND USING EXISTING MCC");
            //in this case also creating CC and Target as primary key will be there to update records
            var c_entries = getRecordsFromCreateContext(CC);
            if(c_entries.length===0){//if doesn't match : Create new TargetPersistantObject and CC
                //logger.warn("CreateNewTargetPersistantObject");
                var new_target_persistant_obj_id = CreateNewTargetPersistantObject(CC,TransformedObject);
                //get the above created target id and create cc with it
                var new_cc = CreateNewCreateContext(CC,new_target_persistant_obj_id);
 
            }
            else{//if match TODO : first check for length is not undefined
                var target_persistant_objet_id = c_entries[0].target_persistant_object_id;
                //logger.warn("updateTargetPersistantObjectByID"+target_persistant_objet_id);
                updateTargetPersistantObjectByID(target_persistant_objet_id,TransformedObject,CC);
            }

        }
        else if(entries.length===1){
            //This will be the ideal case
            var target_persistant_objet_id = entries[0].target_persistant_object_id;

            updateTargetPersistantObjectByID(target_persistant_objet_id,TransformedObject,MCC);

            //******************Create new/update CC********************
            var c_entries = getRecordsFromCreateContext(CC);
            if(c_entries.length===0){
                //creating new CC
                var new_cc = CreateNewCreateContext(CC,target_persistant_objet_id)
                }


        }
        else{
            //Not possible : consider first one
        }


    }
    //else{
    //    //Not possible : consider first one
    //}
}
catch(e){
    result = "error: "+e;
}

