//INPUTS input(JSON)
// OUTPUTS: STRING

var result = "";
var params = {
    cc: Things["GenericIEMasterConfig"].EmailConfiguration.CC,
    bcc: Things["GenericIEMasterConfig"].EmailConfiguration.BCC /* STRING */,
    subject: input.Subject /* STRING */,
    from: "noreply@quantela.com" /* STRING */,
    to: Things["GenericIEMasterConfig"].EmailConfiguration.To,
    body: input.payload /* HTML */
};
result = Things["EmailAlertsThing"].SendMessage(params);
