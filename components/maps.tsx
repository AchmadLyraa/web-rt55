"use client";
import { useEffect, useRef } from "react";

export function Maps() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (!document.getElementById("maplibre-css")) {
      const link = document.createElement("link");
      link.id = "maplibre-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
      document.head.appendChild(link);
    }

    const initMap = async () => {
      if (!mapContainer.current || map.current) return;

      const maplibregl = (await import("maplibre-gl")).default;

      const lat = -1.238545;
      const lng = 116.854958;
      const radiusKm = 0.15;

      const createCircle = (
        centerLng: number,
        centerLat: number,
        radiusKm: number,
        points = 64,
      ) => {
        const coords = [];
        for (let i = 0; i < points; i++) {
          const angle = (i * 360) / points;
          const rad = (angle * Math.PI) / 180;
          const dx = radiusKm / 111.32;
          const dy =
            radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180));
          coords.push([
            centerLng + dy * Math.sin(rad),
            centerLat + dx * Math.cos(rad),
          ]);
        }
        coords.push(coords[0]);
        return coords;
      };

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: [lng, lat],
        zoom: 16,
        antialias: true,
      });

      map.current.on("load", () => {
        const circleCoords = createCircle(lng, lat, radiusKm);

        // Cek dulu sebelum addSource & addLayer
        if (!map.current.getSource("rt-area")) {
          map.current.addSource("rt-area", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Polygon",
                    coordinates: [circleCoords],
                  },
                },
              ],
            },
          });
        }

        if (!map.current.getLayer("rt-fill")) {
          map.current.addLayer({
            id: "rt-fill",
            type: "fill",
            source: "rt-area",
            paint: {
              "fill-color": "#2563eb",
              "fill-opacity": 0.15,
            },
          });
        }

        if (!map.current.getLayer("rt-border")) {
          map.current.addLayer({
            id: "rt-border",
            type: "line",
            source: "rt-area",
            paint: {
              "line-color": "#2563eb",
              "line-width": 2.5,
              "line-dasharray": [4, 2],
            },
          });
        }

        const el = document.createElement("div");
        el.style.cssText = `
          width: 36px;
          height: 36px;
          background: #2563eb;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(37,99,235,0.5);
          cursor: pointer;
        `;

        new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `<div style="font-family:sans-serif;padding:4px 8px">
                <strong style="font-size:14px">RT 55</strong><br/>
                <span style="font-size:12px;color:#666">Wilayah RT 55</span>
              </div>`,
            ),
          )
          .addTo(map.current);
      });

      map.current.addControl(new maplibregl.NavigationControl(), "top-right");
      map.current.addControl(
        new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }),
        "bottom-left",
      );
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg shadow-lg overflow-hidden"
      />
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "10px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "8px",
          padding: "6px 12px",
          fontSize: "11px",
          color: "#444",
          pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            background: "rgba(37,99,235,0.15)",
            border: "2px dashed #2563eb",
            borderRadius: 2,
          }}
        ></span>
        Wilayah RT 55
      </div>
    </div>
  );
}
