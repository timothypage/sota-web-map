import styles from "./LayerInfo.module.css";

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
  RA: "Restricted Access",
  XA: "No Access",
};

const designationMap = {
  NP: "National Park",
  NM: "National Monument",
  NCA: "Conservation Area",
  NF: "National Forest",
  NG: "National Grassland",
  PUB: "National Public Lands",
  NT: "National Scenic or Historic Trail",
  NWR: "National Wildlife Refuge",
  WA: "Wilderness Area",
  WSR: "Wild and Scenic River",
  WSA: "Wilderness Study Area",
  MPA: "Marine Protected Area",
  NRA: "National Recreation Area",
  NSBV: "National Scenic, Botanical or Volcanic Area",
  NLS: "National Lakeshore or Seashore",
  IRA: "Inventoried Roadless Area",
  ACEC: "Area of Critical Environmental Concern",
  RNA: "Research Natural Area",
  REC: "Recreation Management Area",
  RMA: "Resource Management Area",
  WPA: "Watershed Protection Area",
  REA: "Research or Educational  Area",
  HCA: "Historic or Cultural Area",
  MIT: "Mitigation Land or Bank",
  MIL: "Military Land",
  ACC: "Access Area",
  SDA: "Special Designation Area",
  PROC: "Approved or Proclamation Boundary",
  FOTH: "Federal Other or Unknown Designation",
  ND: "Not Designated",
  TRIBL: "Native American Land Area",
  OCS: "Outer Continental Shelf Area",
  SP: "State Park",
  SW: "State Wilderness",
  SCA: "State Conservation Area",
  SREC: "State Recreation Area",
  SHCA: "State Historic or Cultural Area",
  SRMA: "State Resource Management Area",
  SOTH: "State Other or Unknown",
  LP: "Local Park",
  LCA: "Local Conservation Area",
  LREC: "Local Recreation Area",
  LHCA: "Local Historic or Cultural Area",
  LRMA: "Local Resource Management Area",
  LOTH: "Local Other or Unknown",
  PCON: "Private Conservation",
  PPRK: "Private Park",
  PREC: "Private Recreation or Education",
  PHCA: "Private Historic or Cultural",
  PAGR: "Private Agricultural ",
  PRAN: "Private Ranch",
  PFOR: "Private Forest Stewardship",
  POTH: "Private Other or Unknown",
  CONE: "Conservation Easement",
  RECE: "Recreation or Education Easement",
  HCAE: "Historic or Cultural Easement",
  AGRE: "Agricultural Easement",
  RANE: "Ranch Easement",
  FORE: "Forest Stewardship Easement",
  OTHE: "Other Easement",
  UNKE: "Unknown Easement",
  UNK: "Unknown",
};

const PadusDisplay = ({ f }) => {
  return (
    <div className={styles.display}>
      <p>Source: PADUS</p>
      <p>Manager: {f.manager_name}</p>
      <p>Name: {f.local_name}</p>
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
