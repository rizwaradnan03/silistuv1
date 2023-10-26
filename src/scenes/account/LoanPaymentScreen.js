import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { Appbar, Caption, TextInput } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../providers/AuthenticationProvider";
import { ScrollView } from "react-native-gesture-handler";
import { createPayment } from "../../api/LoanApi";

const LoanPayment = ({ navigation }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [rekeningPengirim, setRekeningPengirim] = useState("");
  const [showTabunganContainer, setShowTabunganContainer] = useState(false);
  const [itemsDropdown, setItemDropdown] = useState(null);

  const route = useRoute();
  const { selectedMethod = "Pilih Metode Pembayaran", parameter } =
    route.params || {};
  const selectedPaymentMethod = selectedMethod || "Pilih Metode Pembayaran";

  // Define 'method' with a try-catch block to handle parsing errors.
  let method = [];

  if (selectedMethod && selectedMethod.description) {
    try {
      method = JSON.parse(selectedMethod.description);
    } catch (error) {
      console.error("Error parsing selectedMethod.description:", error);
    }
  }

  const [amount, setAmount] = useState("Rp. 0");
  const { login } = useContext(AuthContext);

  const handleCreateSavingAccount = () => {
    Alert.alert(
      "Terima kasih",
      "Pengajuan setoran anda telah berhasil dilakukan. Pihak Bank akan melakukan verifikasi atas transaksi anda. Apabila transaksi telah diverifikasi, anda akan menerima notifikasi mengenai status transaksi anda"
    );
    navigation.goBack();
  };

  const handleTextInputFocus = () => {
    setIsFocused(true);
  };

  const handleTextInputBlur = () => {
    setIsFocused(false);
  };

  const checkTabunganContainerVisibility = (rekeningPengirim, inputValue) => {
    if (rekeningPengirim && inputValue && inputValue !== "Rp.") {
      setShowTabunganContainer(true);
    } else {
      setShowTabunganContainer(false);
    }
  };

  const handleInputChange = (text) => {
    const cleanedText = text.replace(/[^\d]/g, "");
    const numericValue = Number.parseInt(cleanedText, 10);
    if (!isNaN(numericValue)) {
      const formattedValue = "Rp. " + numericValue.toLocaleString();
      setAmount(formattedValue);
      setInputValue(text);
      checkTabunganContainerVisibility(rekeningPengirim, text);
    } else {
      // Jika "Jumlah" kosong atau tidak valid, sembunyikan tabunganContainer
      setShowTabunganContainer(false);
    }
  };

  const handleRekeningPengirimChange = (text) => {
    setRekeningPengirim(text);
    checkTabunganContainerVisibility(text, inputValue);
  };

  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert("Error", "Kolom Jumlah Belum Di isi.");
    } else if (!rekeningPengirim) {
      Alert.alert("Error", "Kolom Rekening Pengirim Belum Di isi.");
    } else {
      Alert.alert("Konfirmasi", "Pastikan data yang anda masukan sudah benar", [
        {
          text: "Batal",
          onPress: () => console.log("Transaksi dibatalkan"),
          style: "cancel",
        },
        {
          text: "Ya",
          onPress: async () => {
            try {
              createPayment(token, {
                loanId: parameter.norek,
                paymentMethodId: selectedMethod.id,
                amount: amount,
                recipient: rekeningPengirim,
              }).then((result) => {
                console.log(result.data.data);
                navigation.navigate("LoanDetail", { id: parameter.norek });
                Alert.alert("Sukses", "Berhasil Mengajukan Setoran. Silahkan cek notifikasi secara berkala"
                )
              });
            } catch (error) {
              console.error("API Error:", error);
            }
          },
        },
      ]);
    }
  };

  const { token } = useContext(AuthContext);

  const handleSelectPaymentMethod = () => {
    navigation.navigate("PaymentMethodSelection");
  };

  return (
    <>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Setoran Tabungan" />
      </Appbar.Header>

      <ScrollView>
        <View style={styles.box}>
          <Caption style={styles.text}>Metode Pembayaran</Caption>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Pilih Metode Pembayaran"
              editable={false}
              value={selectedMethod.title}
              disabled
            />
          </View>
          <Caption style={styles.text}>Nama Rekening Pengirim</Caption>
          <TextInput
            style={styles.input}
            underlineColor="transparent"
            placeholderTextColor="#999999"
            onChangeText={handleRekeningPengirimChange}
            value={rekeningPengirim}
          />
          <Caption style={styles.text}>Jumlah</Caption>
          <TextInput
            style={styles.input}
            underlineColor=""
            placeholder={isFocused ? "Rp." : ""}
            placeholderTextColor="#999999"
            onFocus={handleTextInputFocus}
            onBlur={handleTextInputBlur}
            keyboardType="numeric"
            value={amount}
            onChangeText={handleInputChange}
          />

          {showTabunganContainer && (
            <View style={styles.tabunganContainer}>
              <Text style={styles.tabunganText}>Tata Cara Setoran</Text>
              {method.map((item, index) => (
                <Text key={index} style={styles.txt}>
                  {index + 1}. {item}
                </Text>
              ))}
              <TouchableOpacity
                style={styles.customButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>SAYA SUDAH TRANSFER</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flex: 1,
    padding: 20,
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: "#F5F8FB",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 18,
    marginTop: "2%",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#080808",
    borderRadius: 5,
    fontSize: 18,
  },
  btn: {
    backgroundColor: Color.primaryBackgroundColor.backgroundColor,
    marginTop: 20,
  },
  btnSubmit: {
    color: "#ffffff",
  },
  box: {
    backgroundColor: "#ffffff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  textInput: {
    height: 40,
    marginBottom: 10,
    borderColor: "#F5F8FB",
    backgroundColor: "transparent",
  },
  showPasswordIcon: {
    marginTop: 15,
  },
  text: {
    marginTop: 15,
  },
  tabunganContainer: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    marginTop: 30,
    borderRadius: 5,
  },
  tabunganText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  txt: {
    marginBottom: 10,
  },
  customButton: {
    backgroundColor: Color.primaryBackgroundColor.backgroundColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoanPayment;
