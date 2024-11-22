import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";

const ReportListScreen = () => {
  const navigation = useNavigation();
  const [reportData, setReportData] = useState([]);

  const getData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/report/fetch/all`);
      setReportData(data.data);
    } catch (e) {
      console.log(e);
      navigation.navigate("Home");
    }
  };

  // useEffect(() => {
  //   getData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    })
  );

  const handlePress = (report) => {
    if (report.plateNumber) {
      navigation.navigate("DetailReportScreen", { report });
    } else {
      navigation.navigate("DetailObstructionScreen", { report });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={styles.reportBox}
    >
      <Text style={styles.date}>{item.createdAt.split("T")[0]}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.description}>
        {item.description.length > 50
          ? `${item.description.substring(0, 50)}...`
          : item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report List</Text>
      <FlatList
        data={reportData}
        renderItem={renderItem}
        keyExtractor={(reportData) => reportData._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ReportListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
  },
  reportBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
