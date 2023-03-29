//INPUTS input(JSON)
// OUTPUTS: result(JSON)

try{
var NonAdminGroupList,AdminGroupList,UserGroupNonadmin,UserGroupAdmin;
var UserGroupName = {"UserGroup" : ''};

var Username = input.Username;

AdminGroupList = Groups["Administrators"].GetGroupMembers();

NonAdminGroupList = Groups["NonAdmin_UG"].GetGroupMembers();

var query = {
"filters": {
"type": "AND",
"filters": [
{
"fieldName": "name",
"type": "EQ",
"value": Username
},
{
"fieldName": "type",
"type": "EQ",
"value": "User"
}
]
}
};

var params = {
	t: AdminGroupList /* INFOTABLE */,
	query: query /* QUERY */
};

var AdminUserTable = Resources["InfoTableFunctions"].Query(params);

var queryNon = {
"filters": {
"type": "AND",
"filters": [
{
"fieldName": "name",
"type": "EQ",
"value": Username
},
{
"fieldName": "type",
"type": "EQ",
"value": "User"
}
]
}
};

var paramsNon = {
	t: NonAdminGroupList /* INFOTABLE */,
	query: queryNon /* QUERY */
};

var NonAdminUserTable = Resources["InfoTableFunctions"].Query(paramsNon);

if(AdminUserTable.length === 1)
{
    UserGroupName["UserGroup"] = "Admin";
}
else if(NonAdminUserTable.length === 1)
{
    UserGroupName["UserGroup"] = "Nonadmin";
}

result = UserGroupName;
}
catch(e)
{
   logger.warn("Exception in GenericIEMasterConfig---->GetUserGroup()"+e.message);
}

