import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import geojson from "../../assets/export.json";
export default function StreetScreen() {
  const [polygonCoords, setPolygonCoords] = useState([]);

useEffect(() => {
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
      </MapView>
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
});
