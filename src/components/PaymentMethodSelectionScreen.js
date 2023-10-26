import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Appbar } from "react-native-paper";
import Color from "../common/Color";
import { AuthContext } from "../providers/AuthenticationProvider";
import { Text } from "react-native";
import { FindPaymentMethod } from "../api/PaymentMethod";
import { useRoute } from "@react-navigation/native";

const PaymentMethodSelectionScreen = ({ navigation, route }) => {
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true); 

  const handleMethodSelection = (method) => {
    setSelectedMethodId(method.title);
    console.log(method.description)
    
    setSelectedMethod(method)
  };

  const { parameter } = route.params
  console.log(parameter)

  const handleContinue = () => {
    if (selectedMethod) {
      navigation.navigate(parameter.route, { selectedMethod, parameter });
    } else {
      alert("Pilih metode pembayaran terlebih dahulu.");
    }
  };

  const { token } = useContext(AuthContext);

  useEffect(() => {
    FindPaymentMethod(token)
      .then((result) => {
        setPaymentMethods(result.data.data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching payment methods:", error);
        setLoading(false); 
      });
  }, [token]);

  return (
    <>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Pilih Metode Pembayaran"
          style={styles.appbarTitle}
        />
      </Appbar.Header>
      {loading ? ( 
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Color.primaryBackgroundColor.backgroundColor}
          />
        </View>
      ) : (
        <View style={styles.box}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={{
                ...(selectedMethodId === method.title
                  ? styles.selectedMethod
                  : styles.method),
                borderWidth: 1,
                borderColor: "black",
              }}
              onPress={() => handleMethodSelection(method)}
            >
              <Text
                style={
                  selectedMethodId === method.title
                    ? styles.selectedText
                    : styles.text
                }
              >
                {method.title}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>LANJUT</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#ffffff",
    padding: 30,
    margin: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  appbarHeader: {
    backgroundColor: "white",
  },
  appbarTitle: {
    color: "black",
  },
  method: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  selectedMethod: {
    backgroundColor: Color.primaryBackgroundColor.backgroundColor,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: Color.primaryBackgroundColor.backgroundColor,
    padding: 10,
    marginVertical: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  text: {
    color: "black",
  },
  selectedText: {
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentMethodSelectionScreen;
