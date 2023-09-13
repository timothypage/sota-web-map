SELECT 
  SummitName as name, 
  SummitCode as code, 
  AssociationName as assoc_name, 
  RegionName as region_name, 
  CAST(AltFt AS INTEGER) as alt, 
  CAST(Points AS INTEGER) as pts, 
  CAST(ActivationCount AS INTEGER) as count, 
  ActivationDate as date, 
  ActivationCall as call, 
  geometry 
FROM 
  summitslist2 
WHERE 
  (AssociationName LIKE 'USA%' 
  OR AssociationName LIKE 'Alaska%')
  AND '$TODAYS_DATE'
    BETWEEN substr(ValidFrom, 7) || substr(ValidFrom, 4, 2) || substr(ValidFrom, 1, 2) AND
            substr(ValidTo  , 7) || substr(ValidTo  , 4, 2) || substr(ValidTo  , 1, 2)
