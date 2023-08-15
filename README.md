# W0C Summits on the Air map

an attempt to create a map from scratch from open / available sources

## Data

where possible we're storing tiles in protomaps files (.pmtiles)

https://protomaps.com/docs

### Summits

A csv of all summits can be grabbed from here

    wget https://storage.sota.org.uk/summitslist.csv


### Public Lands 

can be viewed here for Colorado: 

https://blm-egis.maps.arcgis.com/home/item.html?id=058c14145bd642b1989aaafac62b155a

should be able to grab map tiles from the tile server https://tiles.arcgis.com/tiles/KbxwQRRfWyEYLgp4/arcgis/rest/services/BLM_CO_SMA_Vector_Tiles/VectorTileServer

it seems each states instance of a BLM Surface Management Agency should be able to provide this sort of data


Colorado BLM Surface Management Agency
https://gbp-blm-egis.hub.arcgis.com/search?categories=lands&groupIds=97bb25da078444d4a04669405f77643b

Download Options or 

FeatureServer
https://services1.arcgis.com/KbxwQRRfWyEYLgp4/arcgis/rest/services/BLM_CO_Surface_Management_Agency/FeatureServer/0/query?f=pbf&geometry=-11779863.303084994,4813698.293288989,-11760295.423843995,4833266.172529988&maxRecordCountFactor=4&resultOffset=0&resultRecordCount=8000&where=1=1&orderByFields=OBJECTID&outFields=OBJECTID,adm_name&quantizationParameters={"extent":{"xmin":-11779863.303084994,"ymin":4813698.293288989,"xmax":-11760295.423843995,"ymax":4833266.172529988},"mode":"view","originPosition":"upperLeft","tolerance":38.21851414257816}&resultType=tile&returnCentroid=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&defaultSR=102100



--------

maybe the PADUS dataset would be useful, it exposes protected areas and public access for large swaths of land in the US

for colorado only https://www.sciencebase.gov/catalog/item/61794fc2d34ea58c3c6f9f69

    ogr2ogr -t_srs EPSG:4326 -f GeoJSON padus_co_wilderness_areas.geojson -where "Des_Tp='WA'" /vsizip/PADUS3_0_State_CO_GeoPackage.zip/PADUS3_0StateCO.gpkg PADUS3_0Combined_StateCO


### 3D elevation profiles

https://www.usgs.gov/the-national-map-data-delivery/gis-data-download?qt-science_support_page_related_con=0#qt-science_support_page_related_con

https://apps.nationalmap.gov/downloader/

1. select "Elevation Products"
1. select "1/3 arc-second DEM" Current
1. hit "Search"
1. go to "Products" tab at the top
1. Add all to Cart
1. go to Cart

grab TXT list of urls from the top via command line

    # fyi file contains windows newlines (if you're on unix...)
    cat data.txt | tr -d "\r" | xargs wget


### Roads and Trails

from openstreetmap

Download from here https://download.geofabrik.de/north-america/us/colorado.html

I used this https://github.com/protomaps/basemaps but it has it's own naming for roads to simplify things over openstreetmap
this can be problematic when trying to use maplibre styles for openstreetmaps

Try and use this https://github.com/onthegomap/planetiler, it can output pmtiles now


### ULS

TODO should be able to download this from somewhere, maybe give a VHF contact potential estimate?


### Repeaterbook

TODO maybe list out VHF repeaters in the area to help drum up contacts?


### GPX tracks

TODO user submitted?  Fuzz tracks for off trail bushwacking, just to show approach?


### Drone footage

TODO not in Wilderness Areas, video of summit?


## Methodology

### Hillshading

Convert GeoTIFF to hillshade? https://medium.com/@david.moraisferreira/shaded-relief-maps-using-gdal-a-beginners-guide-6a3fe56c6d

Check Pixel Size

    cat data.txt | awk -F '/' '{print $10}' | tr -d '\r' | xargs -I{} gdalinfo {} | grep "Pixel Size" | sort | uniq -c


Create a Virtual Dataset combining GeoTiffs

    cat data.txt | awk -F '/' '{print $10}' | tr -d '\r' > input-files.txt
    gdalbuildvrt -r nearest colorado_dem.vrt -input_file_list input-files.txt

generate hillshade file

    gdaldem hillshade colorado_dem.vrt colorado_hillshade.tif -co BIGTIFF=YES -co TILED=YES -co COMPRESS=DEFLATE -of GTiff -z 1.0 -s 0.5 -multidirectional

    gdal_translate colorado_hillshade.tif colorado_hillshade_geo.tif -of COG -co COMPRESS=LZW


from the geotif, to get xyz tiles (note the --xyz, which is default for MapLibreGL, which is not TMS which is the OSGeo default).
Tiles go into a folder
https://gdal.org/programs/gdal2tiles.html

    gdal2tiles.py --processes=4 --zoom=5-16 --xyz --s_srs=EPSG:4269 colorado_hillshade_geo.tif ./hillshade_tiles


### Contours

    gdal_contour -b 1 -a ELEV -i 50.0 -f "GPKG" /Users/tim/code/w0c-sota-map/geotiffs/colorado_dem.vrt /Users/tim/code/w0c-sota-map/geotiffs/colorado_contours.gpkg


### Hiking and Driving directions

TODO load into postgis and sort by driving time hiking time (maybe an "agony" score)


## Image Processing

    docker run -d --hostname my-rabbit --name some-rabbit -p 8080:15672 rabbitmq:3-management
