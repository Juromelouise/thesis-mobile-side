import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card, Title, Paragraph } from 'react-native-paper';

const ApproveReports = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Animated.Text entering={FadeInDown} style={styles.headerText}>
        Approved Reports
      </Animated.Text>
      {data.map((report, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate("ViewApprovedReport", { report })}
        >
          <Animated.View
            entering={FadeInUp.delay(index * 100)}
            style={styles.reportCard}
          >
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.reportTitle}>{report.location}</Title>
                <Paragraph style={styles.reportDescription}>{report.original}</Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
        </TouchableOpacity>
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
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
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
  },
  reportDescription: {
    fontSize: 16,
    color: "#666",
  },
});