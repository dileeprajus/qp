/**
 * Created by mohanjutru on 3/9/19.
 */

//INPUTS: input(JSON)
//OUTPUT: JSON
var ScriptLogStatus = input.isEnableLogs;

me.isEnableScriptLogs = ScriptLogStatus;

var result = {"Status": me.isEnableScriptLogs};