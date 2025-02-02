import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import * as Animatable from "react-native-animatable";

const ApproveReports = () => {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/report/admin/obstruction/report/approved`
          );
          setData(response.data.data);
          console.log(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.headerText}>
        Approved Reports
      </Animatable.Text>
      {data.map((report, index) => (
        <Animatable.View
          key={index}
          animation="fadeInUp"
          delay={index * 100}
          style={styles.reportCard}
        >
          <Text style={styles.reportTitle}>{report.location}</Text>
          <Text style={styles.reportDescription}>{report.description}</Text>
        </Animatable.View>
      ))}
    </ScrollView>
  );
};

export default ApproveReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  reportCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  reportDescription: {
    fontSize: 16,
    color: "#666",
  },
});