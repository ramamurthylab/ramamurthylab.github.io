(() => {
  'use strict';
  const element = document.getElementById('lab-map');
  const data = window.labCampusData;
  if (!element || !window.L || !data) return;
  const L = window.L;
  const lab = [33.970674, -117.3275401];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = L.map(element, {
    preferCanvas: true,
    minZoom: 15, maxZoom: 19,
    maxBounds: data.bounds, maxBoundsViscosity: 1,
    zoomControl: false, scrollWheelZoom: true,
    zoomAnimation: !reducedMotion, fadeAnimation: !reducedMotion,
    markerZoomAnimation: !reducedMotion
  }).setView(lab, 17);
  map.attributionControl.setPrefix(false);
  map.attributionControl.addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>');
  L.control.zoom({position: 'topright'}).addTo(map);
  L.control.scale({position: 'bottomleft', imperial: false}).addTo(map);

  const baseOptions = {interactive: false, bubblingMouseEvents: false};
  L.geoJSON(data.geojson, {
    ...baseOptions,
    filter: feature => feature.properties.kind === 'land',
    style: feature => ({
      color: '#e6e6e6', weight: .5, fillOpacity: 1,
      fillColor: ['wood', 'forest', 'scrub'].includes(feature.properties.subtype) ? '#e3e3e3' : feature.properties.subtype === 'water' ? '#d2d2d2' : '#ededed'
    })
  }).addTo(map);
  L.geoJSON(data.geojson, {
    ...baseOptions,
    filter: feature => feature.properties.kind === 'building',
    style: {color: '#d0d0d0', weight: .7, fillColor: '#dedede', fillOpacity: 1}
  }).addTo(map);
  const foot = new Set(['footway', 'path', 'steps', 'pedestrian', 'cycleway']);
  const roadWeight = subtype => foot.has(subtype) ? 1.5 : ['motorway', 'motorway_link', 'trunk'].includes(subtype) ? 9 : ['primary', 'secondary', 'tertiary'].includes(subtype) ? 6 : 3.8;
  const roadStyle = (feature, border) => {
    const subtype = feature.properties.subtype;
    const weight = roadWeight(subtype) * Math.pow(1.28, map.getZoom() - 17);
    return {color: border ? '#cecece' : '#fff', weight: weight + (border ? 1.8 : 0), opacity: 1, lineCap: 'round', lineJoin: 'round'};
  };
  const edges = L.geoJSON(data.geojson, {
    ...baseOptions,
    filter: feature => feature.properties.kind === 'road' && !foot.has(feature.properties.subtype),
    style: feature => roadStyle(feature, true)
  }).addTo(map);
  const roads = L.geoJSON(data.geojson, {
    ...baseOptions,
    filter: feature => feature.properties.kind === 'road',
    style: feature => roadStyle(feature, false)
  }).addTo(map);

  const pin = L.divIcon({
    className: 'lab-map-pin', iconSize: [30, 42], iconAnchor: [15, 42], tooltipAnchor: [15, -25],
    html: '<svg width="30" height="42" viewBox="0 0 30 42" aria-hidden="true"><path d="M15 1C7.3 1 1 7.2 1 15c0 10 14 26 14 26s14-16 14-26C29 7.2 22.7 1 15 1Z" fill="#222" stroke="#fff" stroke-width="1.5"/><circle cx="15" cy="15" r="5" fill="#fff"/></svg>'
  });
  L.marker(lab, {icon: pin, title: 'Psychology Building, UC Riverside', alt: 'Psychology Building, UC Riverside', riseOnHover: true})
    .addTo(map).bindTooltip('Psychology Building', {permanent: true, direction: 'right', className: 'lab-map-tooltip'});

  const reset = L.Control.extend({
    options: {position: 'topright'},
    onAdd() {
      const box = L.DomUtil.create('div', 'leaflet-bar lab-map-reset');
      const button = L.DomUtil.create('button', '', box);
      button.type = 'button'; button.title = 'Return to the Psychology Building';
      button.setAttribute('aria-label', 'Return to the Psychology Building');
      button.innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
      L.DomEvent.disableClickPropagation(box);
      L.DomEvent.on(button, 'click', () => map.setView(lab, 17, {animate: !reducedMotion}));
      return box;
    }
  });
  map.addControl(new reset());

  const labelLayer = L.layerGroup().addTo(map);
  const candidates = data.labels.filter(label => !/psychology/i.test(label.name)).sort((a,b) => a.priority - b.priority || a.distance - b.distance);
  const updateLabels = () => {
    labelLayer.clearLayers();
    const size = map.getSize();
    const pinPoint = map.latLngToContainerPoint(lab);
    const occupied = [[pinPoint.x-20, pinPoint.y-45, pinPoint.x+165, pinPoint.y+8]];
    for (const label of candidates) {
      if (map.getZoom() < 16 && label.priority > 0) continue;
      if (map.getZoom() < 17 && label.kind === 'building' && label.distance > .000045) continue;
      const point = map.latLngToContainerPoint(label.latlng);
      const width = Math.min(180, Math.max(48, label.name.length*6));
      const height = label.name.length > 25 ? 30 : 16;
      const rect = [point.x-width/2-5, point.y-height/2-4, point.x+width/2+5, point.y+height/2+4];
      if (rect[0]<5 || rect[1]<8 || rect[2]>size.x-42 || rect[3]>size.y-26) continue;
      if (occupied.some(other => rect[0]<other[2] && rect[2]>other[0] && rect[1]<other[3] && rect[3]>other[1])) continue;
      const text = document.createElement('span');
      text.textContent = label.name;
      text.style.width = `${width}px`;
      const icon = L.divIcon({className: `lab-map-label ${label.kind === 'road' ? 'road-label' : 'building-label'}`, html: text, iconSize: [0,0]});
      L.marker(label.latlng, {icon, interactive: false, keyboard: false}).addTo(labelLayer);
      occupied.push(rect);
    }
  };
  map.on('moveend zoomend resize', updateLabels);
  map.on('zoomend', () => {
    edges.setStyle(feature => roadStyle(feature, true));
    roads.setStyle(feature => roadStyle(feature, false));
  });
  new ResizeObserver(() => map.invalidateSize({pan:false})).observe(element);
  updateLabels();
})();
