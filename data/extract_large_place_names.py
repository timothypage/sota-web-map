import osmium
import pandas
import shapely
import shapely.wkt
from shapely.geometry import shape, Point
import json
import fiona

from tqdm import tqdm

file = "./us.osm.pbf"
# file = "./colorado.osm.pbf"

states = fiona.open('/vsizip/states.zip')

wktfab = osmium.geom.WKTFactory()

all_way_ids = set()

total_way_count = 124163486

print("Collecting relevant ways")

class OSMRelationHandler(osmium.SimpleHandler):
  def __init__(self, total_way_count):
    osmium.SimpleHandler.__init__(self)
    self.osm_data = []
    self.way_count = 0
    self.progress_bar = tqdm(total=total_way_count)

  def add_inventory(self, elem, elem_type):
    if (elem.tags.get("place") in ["city", "town", "village"]):

      way_ids = set()

      for member in elem.members:
        if member.type == "w":
          all_way_ids.add(member.ref)
          way_ids.add(member.ref)


      self.osm_data.append({
        "name": elem.tags.get("name"),
        "state": elem.tags.get("is_in:state"),
        "state_code": elem.tags.get("is_in:state_code"),
        "wikipedia": elem.tags.get("wikipedia"),
        "place": elem.tags.get("place"),
        "type": elem_type,
        "admin_level": elem.tags.get("admin_level"),
        "way_ids": way_ids
      })

  def relation(self, r):
    self.add_inventory(r, "relation")

  def way(self, w):
    self.way_count += 1
    self.progress_bar.update(1)


relation_handler = OSMRelationHandler(total_way_count)
relation_handler.apply_file(file)

relation_handler.progress_bar.close()

print(f"found {len(relation_handler.osm_data)} relations")
print(f"found {relation_handler.way_count} ways")

ways_by_id = {}

states_by_code = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming",
  "DC": "DC"
}

print()
print("Going around a second time to get geometries")

class OSMWayHandler(osmium.SimpleHandler):
  def __init__(self, way_count):
    super().__init__()
    self.progress_bar = tqdm(total=way_count)

  def way(self, way):
    if way.id in all_way_ids:
      wkt = wktfab.create_linestring(way)
      ways_by_id[way.id] = wkt

    self.progress_bar.update(1)

way_handler = OSMWayHandler(relation_handler.way_count)
way_handler.apply_file(file, locations=True, idx="flex_mem")
way_handler.progress_bar.close()

print("coverting geometry and classifying state locations")
print()

bounds = []
for item in tqdm(relation_handler.osm_data):
  geometries = []

  if not item['way_ids']: 
    continue

  for way_id in item['way_ids']:
    if way_id in ways_by_id:
      geometries.append(ways_by_id[way_id])

  if len(geometries) == 0:
    print(f"dropping due to no geometries {item}")
    continue

  lngs_lats = shapely.bounds(shapely.union_all([shapely.wkt.loads(g) for g in geometries])).tolist()

  place_bounds = [
    [lngs_lats[0], lngs_lats[1]],
    [lngs_lats[2], lngs_lats[3]]
  ]

  name = item["name"]

  if item["state"]:
    name = f'{item["name"]}, {item["state"]}'
  elif item["state_code"]:
    name = f'{item["name"]}, {states_by_code[item["state_code"]]}'
  elif item["wikipedia"]:
    name = item["wikipedia"][3:]
  elif bounds and bounds[0]:
    for state in states:
      if Point(place_bounds[0][0], place_bounds[0][1]).within(shape(state['geometry'])):
        name = f'{item["name"]}, {state.properties["NAME"]}'
        break


  bounds.append({
    "name": name,
    "type": item["place"],
    "bounds": place_bounds,
    # "state": item["state"],
    # "state_code": item["state_code"],
    # "wikipedia": item["wikipedia"]
  })


with open('places.json', 'w') as file:
  file.write(json.dumps(bounds))

