SELECT 
  Des_Tp AS designation, 
  Mang_Type AS manager_type, 
  Mang_Name AS manager_name, 
  Loc_Nm AS local_name, 
  Loc_Own AS local_owner, 
  Pub_Access AS public_access, 
  CASE 
    WHEN Des_Tp IN ('NF', 'NG') AND Pub_Access = 'OA' THEN 'national_forest_or_grassland' 
    WHEN Mang_Name = 'BLM' AND Pub_Access = 'OA' AND Des_Tp NOT IN ('WSR') THEN 'blm' 
    WHEN Mang_Name IN ('CNTY', 'REG', 'RWD') AND Pub_Access = 'OA' THEN 'county_parks_and_open_space' 
    WHEN Mang_Type = 'STAT' AND Mang_Name = 'SLB' THEN 'state_land_board' 
    WHEN Des_Tp IN ('SP', 'SW', 'SCA', 'SREC', 'SOTH', 'SHCA', 'SRMA') AND Pub_Access = 'OA' THEN 'state_parks_or_conservation_area' 
    WHEN Des_Tp IN ('LP', 'LREC', 'LOTH', 'LHCA', 'LCA', 'CONE') AND Pub_Access = 'OA' THEN 'local_park' 
    WHEN Des_Tp = 'WA' AND Mang_Name != 'NPS' THEN 'wilderness_area' 
    WHEN Mang_Type IN ('PVT', 'NGO') AND Pub_Access = 'OA' THEN 'private_open_access' 
    WHEN Mang_Type IN ('STAT', 'JNT') AND Pub_Access = 'OA' THEN 'other_state_or_regional' 
    WHEN Mang_Name = 'FED' OR Mang_Type IN ('FED', 'TRIB') AND Pub_Access = 'OA' THEN 'other_federal'
    WHEN Mang_Type = 'LOC'AND "Pub_Access" = 'OA' THEN 'other_local' 
    ELSE 'unknown' 
  END display_type,
  SHAPE 
FROM 
  PADUS3_0Combined_Proclamation_Marine_Fee_Designation_Easement 
WHERE 
  Des_Tp NOT IN ('IRA', 'PROC', 'MPA', 'TRIBL') 
  AND NOT (
    Mang_Type IN (
      'PVT', 'NGO', 'LOC', 'STAT', 'DIST', 
      'JNT'
    ) 
    AND Pub_Access != 'OA'
  ) 
  AND NOT (
    Des_Tp IN ('SCA', 'CONE') 
    AND Pub_Access != 'OA'
  ) 
  AND NOT Des_Tp IN ('WSA', 'WSR', 'UNKE', 'NWR') 
  AND NOT Mang_Name IN ('NPS', 'BOEM', 'DOD') 
  AND NOT (
    Mang_Name = 'FED' 
    AND Des_Tp != 'WA' 
    AND Pub_Access != 'OA'
  ) 
  AND NOT (
    Mang_Type = 'UNK' 
    OR Mang_Name = 'UNK'
  ) 
  AND NOT (
    Mang_Type = 'TRIB' 
    AND Pub_Access != 'OA'
  ) 
  AND SHAPE IS NOT NULL
