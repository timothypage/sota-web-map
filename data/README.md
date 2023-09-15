# GIS Data processing

most of this is done in BASH which should work on any Linux or MacOS platform

for Windows I'd recommend WSL 2, open up cmd.exe and run `wsl --install`. Just a note, the file system mounted inside WSL for windows integration can be slow. I'd recommend doing most of the downloading and processing in `/home/<username>` and then copying it to `/mnt/c` when you have a finished product

## Requirements

- [Planetiler](https://github.com/onthegomap/planetiler)
- [tippecanoe (felt version)](https://github.com/felt/tippecanoe)
- [GDAL](https://gdal.org)

macos (with [Homebrew](https://brew.sh/))
```bash
brew install gdal
```

debian
```bash
apt install gdal
```

windows - see https://gdal.org/download.html#windows


## Streets and Trails

this will download and build a pmtiles archive of the United States (takes about an hour)

you can change the area (and probably the output filename too 😉) for a smaller area.  US states work well
```bash
wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar

java -Xmx16g -jar planetiler.jar --download --area=us --transportation_z13_paths=true --output=us.pmtiles
```

## SOTA Summits

```bash
wget https://storage.sota.org.uk/summitslist.csv
```

remove first row
```bash
tail -n +2 summitslist.csv > summitslist2.csv
```


```bash
export TODAYS_DATE=$(date +%Y%m%d)

export SUMMIT_QUERY=$(envsubst < ogr2ogr_summitslist_query.sql | tr "\t" " " | tr -d "\n" | tr -s " ")

ogr2ogr -f GeoJSON us_sota_summits.geojson -nln summits -dialect SQLITE -sql "$SUMMIT_QUERY" -oo X_POSSIBLE_NAMES=Longitude -oo Y_POSSIBLE_NAMES=Latitude summitslist2.csv
```

## US Protected Areas Database

Download `PADUS3_0Geodatabase.zip` from here https://www.sciencebase.gov/catalog/item/61794fc2d34ea58c3c6f9f69#attached-files

```bash
export PADUS_QUERY=$(tr "\t" " " < ogr2ogr_padus_query.sql | tr -d "\n" | tr -s " ")

ogr2ogr -t_srs EPSG:4326 -f GeoJSON padus.geojson -dialect SQLITE -sql "$PADUS_QUERY" /vsizip/PADUS3_0Geodatabase.zip/PAD_US3_0.gdb

tippecanoe --maximum-zoom=14 --minimum-zoom=8 --drop-densest-as-needed -o padus.pmtiles padus.geojson
```

### Proclaimed Areas

this seems like a nicer thing to display when zoomed out

```bash
ogr2ogr -t_srs EPSG:4326 -f GeoJSON us_federal_proclaimed_areas.geojson -sql "SELECT Unit_Nm as name, Mang_Name as dept FROM PADUS3_0Proclamation WHERE Mang_Name IN ('DOD', 'NPS', 'USFS')" /vsizip/PADUS3_0Geodatabase.zip/PAD_US3_0.gdb

tippecanoe -zg --drop-densest-as-needed -o us_federal_proclaimed_areas.pmtiles us_federal_proclaimed_areas.geojson
```


## Topo

Sign up for a NASA EathData account here https://urs.earthdata.nasa.gov/users/new

Easily download tiles from here http://dwtkns.com/srtm30m/


```bash
gdalbuildvrt -vrtnodata -9999 dem_hr_9999.vrt *.hgt.zip

gdalwarp -r cubicspline -s_srs EPSG:4326 -t_srs EPSG:3857 -dstnodata None -co COMPRESS=DEFLATE dem_hr_9999.vrt dem_hr_epsg3857.vrt

python3 -m venv venv

source venv/bin/activate

pip install git+https://github.com/timothypage/rio-rgbify.git

rio rgbify -b -10000 -i 0.1 --min-z 6 --max-z 13 --format webp dem_hr_epsg3857.vrt terrain_webp.mbtiles

pmtiles convert terrain_webp.mbtiles terrain.pmtiles
```

[maplibre-contour](https://github.com/onthegomap/maplibre-contour) doesn't support pmtiles, so it needs to be served xyz tiles

```bash
pmtiles serve --cors="*" .
```
