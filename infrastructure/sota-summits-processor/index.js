import fs from "node:fs";

import { parse as parseDate } from 'date-fns';
import { parse as parseCSV } from 'csv-parse/sync';
import { parse as parseHTML } from 'node-html-parser';
import GeoJSON from 'geojson';
import hash from 'object-hash';
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const DATE_FORMAT = "dd/MM/yyyy";
const Bucket = "tzwolak.com";

const s3 = new S3Client({});

async function main() {
  const buf = fs.readFileSync("./summitslist.csv");
  const summits = parseBufferToUsaSummits(buf);
  const geojson = GeoJSON.parse(summits, {Point: ['lat', 'lon']});

  const summit_hash = hash(geojson).slice(0, 6);

  const filename = `us_sota_summits-${summit_hash}.geojson`;

  let response = await s3.send(new PutObjectCommand({
    Bucket,
    Key: `tiles/${filename}`,
    Body: JSON.stringify(geojson)
  }))

  console.log('filename', filename);

  let response = await s3.send(new GetObjectCommand({
    Bucket,
    Key: "map.html"
  }))

  const str = await response.Body.transformToString();
  const html = parseHTML(str);
  html.querySelector("#summits").set_content(filename);

  let response = await s3.send(new PutObjectCommand({
    Bucket,
    Key: "map.html",
    Body: html.toString()
  }));
}

export function parseBufferToUsaSummits(buf) {

  const csv = parseCSV(
    buf.slice( buf.indexOf("\n") ), // skip first line of csv
    { columns: true, skip_empty_lines: true }
  )

  const summits = csv.filter(item => {
    if(!( item.AssociationName.startsWith("USA") || item.AssociationName.startsWith("Alaska") ) ) return false;

    const from = parseDate(item.ValidFrom, DATE_FORMAT, new Date());
    const to = parseDate(item.ValidTo, DATE_FORMAT, new Date());
    const now = new Date();

    if (now < from || now > to) return false;

    return true;
  }).map(
    item => ({
      name: item.SummitName,
      code: item.SummitCode,
      assoc_name: item.AssociationName,
      region_name: item.RegionName,
      alt: Number(item.AltFt),
      pts: Number(item.Points),
      count: Number(item.ActivationCount),
      date: item.ActivationDate,
      call: item.ActivationCall,
      lat: item.Latitude,
      lon: item.Longitude
    })
  )

  return summits;
}

main();
