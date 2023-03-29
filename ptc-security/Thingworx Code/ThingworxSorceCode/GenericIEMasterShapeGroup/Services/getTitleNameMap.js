// result: JSON
titleJSON = {"title":""};
var AllJSON =  Things["MappingConfig"].GetAllConfigs({
	groupName: input.groupName /* STRING */,
	groupType: input.groupType /* STRING */,
	type: undefined /* STRING */
});

var MapConfigs = AllJSON.Configs; 
for (var i=0;i<MapConfigs.length;i++)
{
    if(MapConfigs[i].Name === input.configName)
    {
        titleJSON.title = MapConfigs[i].Title;
    }
}

result = titleJSON;