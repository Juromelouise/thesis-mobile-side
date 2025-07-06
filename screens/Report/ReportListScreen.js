import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import { Picker } from "@react-native-picker/picker";
import LottieView from "lottie-react-native";

const ReportListScreen = () => {
  const navigation = useNavigation();
  const [reportData, setReportData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/report/fetch/all`);
      if (filter === "illegal_parking") {
        setReportData(data.data.filter((item) => item.plateNumber === true));
      } else if (filter === "obstruction") {
        setReportData(data.data.filter((item) => item.plateNumber === false));
      } else {
        setReportData(data.data);
        console.log(data.data);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("Home");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [filter])
  );

  const handlePress = (report, plateNumber) => {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (!reportData || reportData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Report List</Text>
        <Picker
          selectedValue={filter}
          style={styles.picker}
          onValueChange={(itemValue) => setFilter(itemValue)}
        >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Vehicle Complaint" value="illegal_parking" />
          <Picker.Item label="Non-Vehicle Complaint" value="obstruction" />
        </Picker>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LottieView
            source={require("../../assets/nodata.json")}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
          <Text style={{ marginTop: 20, fontSize: 18, color: "#888" }}>
            No Data Available
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report List</Text>
      <Picker
        selectedValue={filter}
        style={styles.picker}
        onValueChange={(itemValue) => setFilter(itemValue)}
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Vehicle Complaint" value="illegal_parking" />
        <Picker.Item label="Non-Vehicle Complaint" value="obstruction" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
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