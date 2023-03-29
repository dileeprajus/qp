/*Inputs: query(String)
Output: Infotable */
-- select TOP 100 * from data_table where entity_id='IELogsDataTable' ORDER BY time DESC; -- if database is mssql system
-- select * from data_table where entity_id='IELogsDataTable' ORDER BY time DESC LIMIT 100; -- if database is postgresql
<<query>>
