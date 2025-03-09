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
import { Picker } from "@react-native-picker/picker";

const ReportListScreen = () => {
  const navigation = useNavigation();
  const [reportData, setReportData] = useState([]);
  const [filter, setFilter] = useState("all");

  const getData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/report/fetch/all`);
      if (filter === "illegal_parking") {
        setReportData(data.data.filter(item => item.plateNumber === true));
      } else if (filter === "obstruction") {
        setReportData(data.data.filter(item => item.plateNumber === false));
      } else {
        setReportData(data.data);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("Home");
    }
  };

  console.log(reportData);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [filter])
  );

  const handlePress = (report, plateNumber) => {
    console.log(plateNumber);
    if (plateNumber === true) {
      navigation.navigate("DetailReportScreen", { report });
    } else {
      navigation.navigate("DetailObstructionScreen", { report });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item._id, item.plateNumber)}
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
      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={(itemValue) => setFilter(itemValue)}
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Illegal Parking" value="illegal_parking" />
        <Picker.Item label="Obstruction" value="obstruction" />
      </Picker>
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
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