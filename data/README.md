# GIS Data processing

most of this is done in BASH which should work on any Linux or MacOS platform

for Windows I'd recommend WSL 2, open up cmd.exe and run `wsl --install`. Just a note, the file system mounted inside WSL for windows integration can be slow. I'd recommend doing most of the downloading and processing in `/home/<username>` and then copying it to `/mnt/c` when you have a finished product

## Requirements

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

- [Planetiler](https://github.com/onthegomap/planetiler)

## Streets and Trails

this will download an build a pmtiles archive of the United States (takes about an hour)

you can change the area (and probably the output filename too 😉) for a smaller area.  US states work well
```
wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar

java -Xmx16g -jar planetiler.jar --download --area=us --transportation_z13_paths=true --output=us.pmtiles
```

## SOTA Summits

```
wget https://storage.sota.org.uk/summitslist.csv
```

remove first row
```
tail -n +2 summitslist.csv > summitslist2.csv
```


```
export SUMMIT_QUERY=$(tr "\t" " " < ogr2ogr_summitslist_query.sql | tr -d "\n" | tr -s " ")
ogr2ogr -f GeoJSON us_sota_summits.geojson -nln summits -dialect SQLITE -sql "$SUMMIT_QUERY" -oo X_POSSIBLE_NAMES=Longitude -oo Y_POSSIBLE_NAMES=Latitude summitslist2.csv
```

## US Protected Areas Database

Download `PADUS3_0Geodatabase.zip` from here https://www.sciencebase.gov/catalog/item/61794fc2d34ea58c3c6f9f69#attached-files

```
export PADUS_QUERY=$(tr "\t" " " < ogr2ogr_summitslist_query.sql | tr -d "\n" | tr -s " ")
ogr2ogr -t_srs EPSG:4326 -f GeoJSON padus.geojson -dialect SQLITE -sql "$PADUS_QUERY" /vsizip/PADUS3_0Geodatabase.zip/PAD_US3_0.gdb
```

## Topo

Using some open terrarium RGB tiles that are open acces for now

```
sources: {

  ...

  terrainSource: {
    type: "raster-dem",
    tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
    tileSize: 512,
    maxzoom: 12,
    encoding: "terrarium"
  }
,

```

otherwise, check out https://github.com/nst-guide/terrain
