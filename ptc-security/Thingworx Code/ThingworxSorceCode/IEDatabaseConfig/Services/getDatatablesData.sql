/*Inputs: thingName(THINGName) query(String)
Output: Infotable */
/*select * from data_table where source_type='Thing';*/

/*select * from data_table where entity_id=[[thingName]];*/
-- if([[thingName]]){
-- 	select * from data_table where <<query>> ORDER BY time DESC LIMIT 100;
-- }
-- select TOP 100 * from data_table where <<query>>; //for Deckers system code
-- select * from data_table where <<query>>;
<<query>>
