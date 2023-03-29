logger.warn("SubScriptionForPurge calling....");
var result = {};
var fromDate='';
var toDate='';

    function getRequiredDate(daysToSubtract){
     var  d = new Date();
     d.setDate(d.getDate() - parseInt(daysToSubtract));
     return d;
   }
    
  function getRequiredDateBySubtractMonth(monthsToSubtract){
     var dt=new Date();
    dt.setDate(dt.getDate()-2);
    dt.setMonth(dt.getMonth() -parseInt(monthsToSubtract));
     return dt;
   }

try{
    logger.warn("Date Duration::: "+me.dateDuration);

    if(me.dateDuration==="Last 1 Week"){
         toDate=getRequiredDate(2).toISOString().replace('Z','');
         fromDate=getRequiredDate(7).toISOString().replace('Z','');
    
    }else if(me.dateDuration==="Last 2 Weeks"){
        toDate=getRequiredDate(2).toISOString().replace('Z','');
         fromDate=getRequiredDate(14).toISOString().replace('Z','');
       
    }else if(me.dateDuration==="Last 1 Month"){
        toDate=getRequiredDate(2).toISOString().replace('Z','');
       fromDate=getRequiredDateBySubtractMonth(1).toISOString().replace('Z','');
       
    }else if(me.dateDuration==="Last 2 Months"){
       toDate=getRequiredDate(2).toISOString().replace('Z','');
       fromDate=getRequiredDateBySubtractMonth(2).toISOString().replace('Z','');
      
     }else if(me.dateDuration==="Last 1 Year"){
        toDate=getRequiredDate(2).toISOString().replace('Z','');
       fromDate=getRequiredDateBySubtractMonth(12).toISOString().replace('Z','');
      
     }else {
    }
    
        logger.warn("From Date as input to PurgeStreamEntries:: "+fromDate);
        logger.warn("To Date as input to PurgeStreamEntries::"+toDate);
    
     nowdate =  new Date().toISOString();
     result = {};
   
    Things["AuditInfoStream"].PurgeStreamEntries({      
        endDate: toDate /* DATETIME */,
        immediate: false /* BOOLEAN */,
        startDate: fromDate /* DATETIME */
     });
  
    result={"success":"Datatable entries are deleted successfully"};

    

}catch(e){
    var result={"Exception":e.message};
    logger.warn("Exception in SubScriptionForPurge service:  "+e.message);
}