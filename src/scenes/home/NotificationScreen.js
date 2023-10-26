import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Headline, Card, Divider, Button } from "react-native-paper";
import { AuthContext } from "../../providers/AuthenticationProvider";
import Color from "../../common/Color";
import {
  NotificationStatus,
  findAllNotificationByToken,
} from "../../api/NotificationApi";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import axios from "axios";

const NotificationScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [pressedNotifications, setPressedNotifications] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalRef = useRef(null);

  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [parsedDescription, setParsedDescription] = useState(null);

  const fetchData = async () => {
    try {
      findAllNotificationByToken(token).then((result) => {
        const apiData = JSON.parse(result.data.data);
        setData(apiData);
        setRefreshing(false);
        console.log(apiData);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(false);
  };

  const isNotificationPressed = (notificationId) => {
    return pressedNotifications.includes(notificationId);
  };

  const toggleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    NotificationStatus(token,notification.id)
    console.log(notification.type);
    if (notification.type !== 9) {
      setIsModalVisible(true);
    } else {
      navigation.navigate("Blog", {
        item: notification.description,
      });
    }

    setPressedNotifications((prevState) => [...prevState, notification.id]);
    setParsedDescription(parseDescription(notification.description));
  };

  const parseDescription = (description) => {
    try {
      const parsedData = JSON.parse(description);
      return parsedData;
    } catch (error) {
      console.error("Error parsing description:", error);
      return { destination: "N/A" };
    }
  };

  return (
    <View style={styles.screen}>
      <View style={Color.primaryBackgroundColor}>
        <Headline style={styles.heading}>Notifikasi</Headline>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card>
          {data && data.length > 0 ? (
            data.map((notification) => (
              <React.Fragment key={notification.id}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Notifikasi diklik:", notification.title);
                    toggleNotificationPress(notification);
                  }}
                >
                  <Card.Content
                    style={[
                      styles.notificationItem,
                      {
                        backgroundColor:
                          isNotificationPressed(notification.id) ||
                          notification.status == 1
                            ? "#F1EFEF"
                            : "transparent",
                      },
                    ]}
                    onLayout={(e) => {
                      // Set tinggi modal saat item di dalamnya diukur
                      if (modalRef.current) {
                        modalRef.current.setNativeProps({
                          style: { height: e.nativeEvent.layout.height },
                        });
                      }
                    }}
                  >
                    <View style={styles.titleContainer}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          notification.type === 1
                            ? { color: "green" }
                            : notification.type === 2
                            ? { color: "red" }
                            : { color: "black" },
                        ]}
                      >
                        {notification.title}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.circleButton,
                        {
                          backgroundColor:
                            isNotificationPressed(notification.id) ||
                            notification.status == 1
                              ? "white"
                              : "blue",
                        },
                      ]}
                    >
                      <View style={styles.circle} />
                    </View>
                    <Text style={styles.dateItem}>
                      {notification.created_at}
                    </Text>
                  </Card.Content>
                </TouchableOpacity>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <View style={styles.noNotificationContainer}>
              <Text style={styles.noNotificationText}>
                Tidak ada notifikasi
              </Text>
            </View>
          )}
        </Card>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            toggleModal();
          }}
        >
          <View
            style={isModalVisible ? styles.centeredView : styles.modalHidden}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>
                {selectedNotification ? selectedNotification.title : ""}
              </Text>
              <View style={styles.horizontalLine} />

              {parsedDescription ? (
                <>
                  {Object.keys(parsedDescription).map((key) => (
                    <React.Fragment key={key}>
                      <Text style={styles.modalTextTitle}>{key}:</Text>
                      <Text style={styles.modalText}>
                        {parsedDescription[key]}
                      </Text>
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <Text style={styles.modalText}>No description available</Text>
              )}
              <Button
                mode="contained"
                style={{ marginTop: 20, ...Color.primaryBackgroundColor }}
                onPress={toggleModal}
              >
                Tutup
              </Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F5F8FB",
    flex: 1,
  },
  heading: {
    marginTop: "15%",
    fontSize: 30,
    marginLeft: "5%",
    paddingBottom: "2%",
    color: "white",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
    marginBottom: 10,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
    position: "relative",
    paddingVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  modalTextTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  circleButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 15,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.2,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  modalView: {
    margin: 20,
    width: "80%",
    backgroundColor: "white",
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    color: "black",
  },
  dateItem: {
    position: "absolute",
    bottom: 0,
    right: 10,
    color: "grey",
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  noNotificationContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noNotificationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  isiDescription: {
    left: 10,
  },
  modalHidden: {
    display: "none",
  },
});

export default NotificationScreen;
