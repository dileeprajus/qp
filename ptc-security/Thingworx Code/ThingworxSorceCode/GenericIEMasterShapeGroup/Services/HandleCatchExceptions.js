//INPUTS input(JSON)
// OUTPUTS: JSON

input['ENV'] = "DEV";
var params = {
    input: input
};
me.SendEmailAlert(params);
var result = {};