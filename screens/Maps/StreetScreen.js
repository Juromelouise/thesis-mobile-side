import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Polygon, Polyline } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import geojson from "../../assets/export.json";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";

// Violation colors as in StreetLegends.jsx
const violationColors = {
  "All Violations": "#808080",           // Gray
  "Overnight parking": "#4B6CB7",        // Blue
  "Hazard parking": "#e57373",           // Red
  "Illegal parking": "#fbc02d",          // Yellow
  "Towing Zone": "#1976d2",              // Deep Blue
  "Loading and Unloading": "#388e3c",    // Green
  "Illegal Sidewalk Use": "#8e24aa",     // Purple
};

const violationsList = [
  { value: "All Violations", label: "All Violations" },
  { value: "Overnight parking", label: "Overnight Parking" },
  { value: "Hazard parking", label: "Hazard parking" },
  { value: "Illegal parking", label: "Illegal parking" },
  { value: "Towing Zone", label: "Towing Zone" },
  { value: "Loading and Unloading", label: "Loading and Unloading" },
  { value: "Illegal Sidewalk Use", label: "Illegal Sidewalk Use" },
];

export default function StreetScreen() {
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [streets, setStreets] = useState([]);

  useEffect(() => {
    // Load boundary polygon from geojson
    const feature = geojson.features[0];
    if (
      feature &&
      feature.geometry &&
      feature.geometry.type === "Polygon" &&
      feature.geometry.coordinates.length > 0
    ) {
      const coords = feature.geometry.coordinates[0].map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }));
      setPolygonCoords(coords);
    }

    axios
      .get(`${BASE_URL}/street/street`)
      .then((response) => {
        const streetData = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        setStreets(streetData || []);
      })
      .catch((error) => console.error("Error fetching streets:", error));
  }, []);

  const initialRegion = {
    latitude: 14.5172,
    longitude: 121.0364,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            strokeColor="#6e44ff"
            fillColor="rgba(110,68,255,0.1)"
            strokeWidth={3}
          />
        )}

        {/* Render street polylines */}
        {streets.map((street, idx) =>
          Array.isArray(street.segments)
            ? street.segments.map((segment, sIdx) =>
                Array.isArray(segment) && segment.length > 1 ? (
                  <Polyline
                    key={`${idx}-${sIdx}`}
                    coordinates={segment.map((c) => ({
                      latitude: c.lat,
                      longitude: c.lng,
                    }))}
                    strokeColor={street.color || violationColors[street.violationType] || "#808080"}
                    strokeWidth={4}
                  />
                ) : null
              )
            : null
        )}
      </MapView>
      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend</Text>
        {violationsList.map((v) => (
          <View key={v.value} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: violationColors[v.value] },
              ]}
            />
            <Text style={styles.legendLabel}>{v.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  legendContainer: {
    position: "absolute",
    bottom: 32, // Move to bottom
    right: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 6,
    padding: 10,
    minWidth: 120,
    maxWidth: 180,
    zIndex: 1000,
    elevation: 4,
  },
  legendTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 15,
    textAlign: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendColor: {
    width: 18,
    height: 8,
    borderRadius: 2,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  legendLabel: {
    fontSize: 13,
  },
});