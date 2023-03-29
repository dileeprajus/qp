/*Inputs: Nothing
Output: Infotable */
-- SELECT SERVERPROPERTY('productversion')
  --   , SERVERPROPERTY('productlevel')
    -- , SERVERPROPERTY('edition'); -- for MSSql system
    --  SELECT @@version as 'thingworxVesion' --for MSSql Sytemd
SELECT version(); -- for postgresql system
