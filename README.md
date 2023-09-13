# US Summits on the Air map

a map from scratch made from open / available sources

## Features

- Client-rendered topographic features (hillshade and contour lines) and 3D terrain visualization
- National Forest and other US Government Public Lands with Private Land and Patented Mining Claim cutouts
- Summits on the Air summit labels

## Tech

Powered by
- [Maplibre GL JS](https://maplibre.org/projects/maplibre-gl-js/)
- [OpenStreetMap](https://www.openstreetmap.org)
- [GDAL](https://gdal.org/)
- [OSRM](http://project-osrm.org/)
- [Open Data from the US Federal Government](https://sciencebase.gov)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)


## Data

where possible we're storing tiles in protomaps files (.pmtiles)

https://protomaps.com/docs

see [data/README.md](data/README.md) for more in-depth information on the below


### SOTA Summits

"Summits on the Air is an award scheme for radio amateurs that encourages portable operation in mountainous areas." - https://www.sota.org.uk/

A csv of all summits can be grabbed from here

    wget https://storage.sota.org.uk/summitslist.csv


### Public Lands

We're using the United States Geological Survey - Protected Areas Database v3 to show areas of the United States open to public access (and some restricted access areas)

More information is available here https://www.usgs.gov/programs/gap-analysis-project/science/protected-areas

Download from here https://www.sciencebase.gov/catalog/item/61794fc2d34ea58c3c6f9f69#attached-files

More info on how we're processing this dataset available in data/README.md


### Roads and Trails

from openstreetmap

Downloaded from here https://download.geofabrik.de/north-america/us.html

We're using https://github.com/onthegomap/planetiler to output pmtiles


### Navigation

click on the map where you want to set your home location, then click the "house" icon.  Proceed to click around where you want to navigate.

Powered by [Project OSRM](http://project-osrm.org/)


## Up and Running

To build the web app you'll need [NodeJS 18](https://nodejs.org/).  I'd recommend using [asdf](https://asdf-vm.com/) or [nvm.sh](https://github.com/nvm-sh/nvm#installing-and-updating) (for windows [nvm-windows](https://github.com/coreybutler/nvm-windows))

```
npm install
npm run dev
```

## Build and deploy

```bash
npm run build && bash deploy.sh
```
note: this does deploy any map tiles in the `tiles/` folder, but does not build them.  Feel free to grab them from `https://tzwolak.com/tiles/<filename>.<ext>` (see main.jsx for a list of map sources in the MaplibreGL setup).
or see data/README.md for how to build your own set.

this project is designed to run "serverless" on AWS [S3](https://aws.amazon.com/s3/) and [CloudFront](https://aws.amazon.com/cloudfront/).

the main advantage of serving maps this way is cost, which are storage @8.5 cents per GB of data, and data transfer @8.5 cents per GB after 1TB free each month


## Contributing

we're using [Prettier](https://prettier.io/) for JavaScript formatting (this is not strictly enforced for now)

just run this before you commit:
```bash
npx prettier --write **/*.js **/*.jsx
```


