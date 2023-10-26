import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import { Headline, Appbar, Subheading } from "react-native-paper";
import { Table, Row } from "react-native-table-component";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-paper";
import { findLoanBillById } from "../../api/LoanApi";
import { AuthContext } from "../../providers/AuthenticationProvider";

const LoanRepaymentScheduleScreen = ({ navigation, route }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Initialize totalPages with a default value

  const [data, setData] = useState([]); // Initialize data as an empty array

  const { token } = useContext(AuthContext);

  const { id } = route.params;

  const fetchDataBill = async () => {
    try {
      const result = await findLoanBillById(token, id);
      console.log("Bill Data from API:", result.data);
      setData(result.data.data);

      // Calculate totalPages after data is fetched
      const totalPages = Math.ceil(result.data.data.length / itemsPerPage);
      setTotalPages(totalPages); // Update the totalPages state
    } catch (error) {
      console.error("Error API:", error);
    }
  };

  useEffect(() => {
    fetchDataBill();
  }, []);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to format repaymentDate to day-month-year
  const formatRepaymentDate = (repaymentDate) => {
    const date = new Date(repaymentDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <View>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Lihat Jadwal Tagihan" />
      </Appbar.Header>

      <View style={styles.box}>
        <View style={styles.container}>
          <Table borderStyle={{ borderWidth: 0 }}>
            <Row
              data={["Angs", "Tanggal", "Pokok", "Bunga", "Total"]}
              style={styles.head}
              textStyle={styles.textHead}
            />
            {getCurrentPageData().map((item, index) => (
              <Row
                key={index}
                data={[
                  index + 1 + (currentPage - 1) * itemsPerPage,
                  formatRepaymentDate(item.repaymentDate), // Format the date
                  item.amount.toLocaleString("en-US") + ".00",
                  item.interestAmount.toLocaleString("en-US") + ".00",
                  item.principalAmount.toLocaleString("en-US") + ".00",
                ]}
                textStyle={styles.textData}
              />
            ))}
          </Table>
        </View>
        {data.length > itemsPerPage && (
          <View style={styles.pagination}>
            {currentPage > 1 && (
              <TouchableOpacity onPress={() => goToPage(currentPage - 1)}>
                <Text
                  style={
                    currentPage === 1 ? styles.disabledButton : styles.button
                  }
                >
                  ← Previous
                </Text>
              </TouchableOpacity>
            )}
            <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
            {currentPage < totalPages && (
              <TouchableOpacity onPress={() => goToPage(currentPage + 1)}>
                <Text
                  style={
                    currentPage === totalPages
                      ? styles.disabledButton
                      : styles.button
                  }
                >
                  Next →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Title: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontSize: 25,
    marginTop: Platform.select({
      android: 30,
    }),
  },
  arrow: {
    marginLeft: Platform.select({
      ios: 10,
      android: 10,
    }),
    marginTop: Platform.select({
      android: 30,
    }),
    marginRight: Platform.select({
      ios: 15,
      android: 15,
    }),
  },
  head: {
    height: 40,
    borderBottomWidth: 0.3,
    marginBottom: 20,
  },
  textHead: {
    margin: 6,
    fontSize: 15,
  },
  textData: {
    margin: 6,
    fontSize: 10,
    width: "100%",
  },
  box: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    margin: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#080808",
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    fontSize: 18,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  button: {
    marginRight: 10,
    backgroundColor: "white",
  },
});

export default LoanRepaymentScheduleScreen;
