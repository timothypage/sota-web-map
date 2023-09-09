import styles from "./LayerInfo.module.css";

const features = [
  {
    source: "padus",
    sourceLayer: "padus",
    properties: {
      designation: "NF",
      manager_type: "FED",
      manager_name: "USFS",
      local_name: "Arapaho and Roosevelt National Forests",
      local_owner: "USDA FOREST SERVICE",
      public_access: "OA",
      display_type: "national_forest_or_grassland",
    },
  },
  {
    source: "us_federal_proclaimed_areas",
    sourceLayer: "us_federal_proclaimed_areas",
    properties: {
      name: "Arapaho National Forest",
      dept: "USFS",
    },
  },
];

const LayerInfo = ({ features }) => {
  if (features.length === 0) return null;

  return (
    <div>
      <h2>Layer Info</h2>
      {features.map((f) =>
        f.source === "padus" ? (
          <PadusDisplay f={f.properties} key={f.source} />
        ) : f.source === "us_federal_proclaimed_areas" ? (
          <ProclaimedAreasDisplay f={f.properties} key={f.source} />
        ) : null
      )}
    </div>
  );
};

const OAMap = {
  OA: "Open Access",
  XA: "Restricted Access",
  NA: "No Access Allowed",
};

const designationMap = {
  NF: "National Forest",
  WA: "Wilderness Area",
  NP: "National Park",
  SP: "State Park",
  PUB: "Public Land",
};

const PadusDisplay = ({ f }) => {
  return (
    <div className={styles.display}>
      <p>Source: PADUS</p>
      <p>Manager: {f.manager_name}</p>
      <p>Access: {OAMap[f.public_access] || f.public_access}</p>
      <p>Designation: {designationMap[f.designation] || f.designation}</p>
    </div>
  );
};

const ProclaimedAreasDisplay = ({ f }) => {
  return (
    <div className={styles.display}>
      <p>Source: PADUS</p>
      <p>Designation: Proclaimed Area</p>
      <p>Manager: {f.dept}</p>
      <p>Name: {f.name}</p>
    </div>
  );
};

export default LayerInfo;
