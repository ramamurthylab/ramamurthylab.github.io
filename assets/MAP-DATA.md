# Campus map data

The interactive map uses OpenStreetMap geometry distributed under the Open Database License (ODbL) 1.0.

- Attribution: © OpenStreetMap contributors
- Copyright and license: https://www.openstreetmap.org/copyright
- Machine-readable derived dataset: `ucr-campus.geojson`
- Source: OpenStreetMap, retrieved with the Overpass API on September 13, 2026.
- Query: ways with highway, building, landuse, leisure, or natural tags in the area bounded by 33.958°–33.988° N and 117.348°–117.305° W; geometry and selected tags are retained for the campus map.
- The source data timestamp is preserved in the GeoJSON metadata.

The black pin marks the Psychology Building at 33.970674° N, 117.3275401° W. Its location was checked against the building's Google Maps embed and the OpenStreetMap Psychology building footprint (way 158533421).

`ucr-campus-data.js` bundles the same geometry and precomputed labels for offline use. No remote map tiles, external frame, Google API key, or geolocation permissions are used. The map is bounded to the UC Riverside campus area and nearby streets. The open-source Leaflet renderer is bundled in `leaflet/`, including its license.
