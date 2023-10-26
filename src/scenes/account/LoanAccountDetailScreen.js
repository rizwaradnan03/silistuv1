import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, FlatList, Alert } from "react-native";
import { Appbar, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import MenuButton from "../../components/common/MenuButton";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { findLoanBillById, findLoanById } from "../../api/LoanApi";
import { FlatGrid } from "react-native-super-grid";
import { Card, Paragraph, Title } from "react-native-paper";

const LoanAccountDetailScreen = ({ navigation, route }) => {
  const [isBalanceShown, setIsBalanceShown] = useState(false);
  const [loanLoading, setLoanLoading] = useState(true);
  const { user, exp } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const { id } = route.params;
  const parameter = {
    route: "LoanPayment",
    norek: id
  }
  const [data, setData] = useState({});
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await findLoanById(token, id);
      setData(result.data.data);
      setSkeletonLoading(false);
      setLoanLoading(false);
    } catch (error) {
      console.error("Error API:", error);
      setSkeletonLoading(false);
      setLoanLoading(false);
    }
  };

  const [bill, setBill] = useState([]);

  const fetchDataBill = async () => {
    try {
      const result = await findLoanBillById(token, id);
      console.log("Bill Data from API:", result.data);
      setBill(result.data.data);
      setSkeletonLoading(false);
      setLoanLoading(false);
    } catch (error) {
      console.error("Error API:", error);
      setSkeletonLoading(false);
      setLoanLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataBill();
  }, []);

  const menus = [
    {
      id: 1,
      title: "Ajukan Restrukturisasi",
      icon: "clipboard-outline",
      onPress: () => {
        // Cek akses di sini jika diperlukan
        if (user.hasRestructureAccess) {
          navigation.navigate("");
        } else {
          Alert.alert(
            "Akses Ditolak",
            "Anda tidak memiliki akses untuk Ajukan Restrukturisasi."
          );
        }
      },
    },
    {
      id: 2,
      title: "Ajukan Top-up Kredit",
      icon: "journal-outline",
      onPress: () => navigation.navigate("LoanTopupRequest",{id : data.id}),
    },
    {
      id: 2,
      title: "Bayar Tagihan",
      icon: "cash-outline",
      onPress: () => navigation.navigate("PaymentMethodSelection",{parameter}),
    },
    {
      id: 4,
      title: "Lihat Jadwal Tagihan",
      icon: "list-outline",
      onPress: () =>
        navigation.navigate("LoanRepaymentScheduleScreen",{id : data.id}),
    },
  ];

  const renderSkeletonLoader = () => {
    return (
      <>
        <ShimmerPlaceholder
          style={{
            width: "80%",
            height: 25,
            marginTop: 10,
            marginBottom: 20,
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "45%",
            height: 20,
            marginTop: 16,
            marginBottom: 20,
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "20%",
            height: 15,
            marginTop: 10,
            marginBottom: 10,
          }}
          autoRun={true}
        />
        <ShimmerPlaceholder
          style={{
            width: "50%",
            height: 17,
            marginTop: 10,
            marginBottom: 20,
          }}
          autoRun={true}
        />
      </>
    );
  };

  const renderAccountInfo = () => {
    return (
      <View>
        <Text style={styles.bankName}>
          {data.productType && data.productType.name
            ? data.productType.name
            : "Product Name Not Available"}
        </Text>
        <Text style={styles.accountNumber}>
          {data.id ? data.id : "Account Number Not Available"}
        </Text>
        <Text style={styles.balanceTitle}>Sisa Pinjaman</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.balance}>
          Rp{" "}
            {isBalanceShown
              ? data.outstandingBalance
                ? ` ${parseFloat(data.outstandingBalance).toLocaleString(
                    "en-US"
                  )}`
                : "Balance Not Available"
              : "******"}
          </Text>
          <IconButton
            onPress={() => setIsBalanceShown(!isBalanceShown)}
            icon={isBalanceShown ? "eye-off" : "eye"}
            size={25}
            style={{ bottom: 5 }}
          />
        </View>
      </View>
    );
  };

  const renderUpcomingRepayment = () => {
    let totalRepayment = 0;
    for (let i = 0; i < bill.length; i++) {
      totalRepayment += Number(bill[i].amount);
    }
    return (
      <Card style={{ ...styles.card, backgroundColor: 'white' }}>
        <Card.Content>
          <Title style={styles.detailHeading}>
            Total Tagihan s.d. Bulan Ini
          </Title>
          <Paragraph style={styles.totalAmount}>
            Rp {totalRepayment.toLocaleString("en")}
          </Paragraph>
          <FlatList
            data={bill}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.billItem}>  
                <Text style={styles.billInfo}>Tagihan ke - {item.term}</Text>
                <Text style={styles.paragraph}>Pokok :</Text>
                <Paragraph>
                  Rp {parseFloat(item.principalAmount).toLocaleString("en")}
                </Paragraph>
                <Text style={styles.paragraph}>Bunga :</Text>
                <Paragraph>
                  Rp {parseFloat(item.interestAmount).toLocaleString("en")}
                </Paragraph>
                <Text style={styles.paragraph}>Denda :</Text>
                <Paragraph>
                  Rp {parseFloat(item.penaltyAmount).toLocaleString("en")}
                </Paragraph>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Kredit" />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.headingBlock}>
          <LinearGradient
            style={styles.headingGradient}
            colors={Color.primaryGradientColor}
          >
            {skeletonLoading ? renderSkeletonLoader() : renderAccountInfo()}
          </LinearGradient>
          <FlatGrid
            data={menus}
            keyExtractor={(item, index) => index.toString()}
            itemDimension={80}
            renderItem={({ item }) => (
              <View style={styles.buttonRow}>
                <MenuButton
                  style={styles.menuButton}
                  iconName={item.icon}
                  title={item.title}
                  numColumns={2}
                  onPress={item.onPress}
                />
              </View>
            )}
          />
        </View>
        {renderUpcomingRepayment()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flexGrow: 1,
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
  },
  headingBlock: {
    marginTop: "3%",
    width: "95%",
    borderRadius: 10,
    alignSelf: "center",
  },
  headingGradient: {
    borderRadius: 10,
    paddingLeft: "7%",
    padding: 30,
  },
  balanceTitle: {
    marginTop: "7%",
    color: "white",
  },
  balance: {
    marginBottom: "6%",
    marginTop: 5,
    fontSize: 21,
    fontWeight: "bold",
    color: "white",
  },
  accountNumber: {
    fontSize: 18,
    color: "white",
    fontFamily: "Credit-Regular",
  },
  bankName: {
    marginBottom: "13%",
    fontSize: 18,
    color: "white",
  },
  contentBlock: {
    paddingTop: "2%",
    flex: 1,
    width: "95%",
    backgroundColor: "white",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 17,
    height: "100%",
    marginBottom: 20,
  },
  detailHeading: {
    marginTop: 5,
    fontSize: 22,
    fontWeight: "bold",
  },
  transactionList: {
    marginTop: "3%",
  },
  transactionAmountCaption: {
    fontSize: 16,
    top: 10,
    fontWeight: "bold",
    marginRight: 10,
  },
  debitTrxAmount: {
    color: "grey",
  },
  creditTrxAmount: {
    color: "#95D362",
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "#EAEBF8",
  },
  buttonRow: {
    flex: 1,
    flexDirection: "column",
    margin: 4,
  },
  billItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  billInfo: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "400",
  },
  paragraph: {
    marginTop: 5,
    fontSize: 17,
  },
  card: {
    margin: 20,
    marginBottom: "30%",
  },
});

export default LoanAccountDetailScreen;
