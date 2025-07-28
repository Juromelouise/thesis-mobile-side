import React, { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const ApproveReportsLocation = () => {
  const [reports, setReports] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/report/admin/report/report/approved`
      );
      
      // Transform the data to match expected structure
      const transformedData = response.data.data.flatMap(item => {
        // Handle plate number reports
        if (item.reportDetails && item.reportDetails.length > 0) {
          return item.reportDetails.map(report => ({
            ...report,
            _id: report._id || item._id // Use report ID if available, fallback to plate number ID
          }));
        }
        // Handle obstructions
        return item;
      }).filter(item => item.geocode); // Only include items with geocode data

      setReports(transformedData);
    } catch (error) {
      console.log("Error fetching reports:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const initialRegion = reports.length > 0 && reports[0].geocode
    ? {
        latitude: reports[0].geocode.latitude,
        longitude: reports[0].geocode.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : {
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
        showsUserLocation={true}
      >
        {reports.map((report, index) => (
          report.geocode && (
            <Marker
              key={`${report._id}-${index}`}
              coordinate={{
                latitude: report.geocode.latitude,
                longitude: report.geocode.longitude,
              }}
              title={report.location || "Report Location"}
              description={report.original || "No description available"}
            />
          )
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ApproveReportsLocation;