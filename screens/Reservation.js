import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import CheckBox from "expo-checkbox";

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  StyledButtonRes,
} from "../components/styles";

// credentials context
import { CredentialsContext } from "./../components/CredentialsContext";
import { listUnavailableCourts, postReservation } from "./utils/Reservation";
import { removeCredit } from "./utils/User";
import { color } from "react-native-elements/dist/helpers";
import { Icon } from "react-native-elements";
import { RollInLeft } from "react-native-reanimated";

const { brand, darkLight, primary } = Colors;

const Reservation = ({ navigation }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isToday = moment().isSame(moment(selectedDate), "day");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());
  const [courts, setCourts] = useState(generateCourts());
  const [checkedStates, setCheckedStates] = useState([]);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [isSubmitting, setSubmitting] = useState(false);
  const [unAvailableCourtNo, setUnAvailableCourtNo] = useState([]);
  const [courtNo, setCourtNo] = useState(0);
  // credentials context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const handleMessage = (message, type = "") => {
    setMessage(message);
    setMessageType(type);
    if (type && type === "Success") {
      setCheckedStates([]);
      handleDateTimeChange(selectedDate, selectedTime);
      ToastAndroid.show("Booking successful!", ToastAndroid.SHORT);
      removeCredit(
        { email: storedCredentials.email, court_no: courtNo, credits: 20 },
        () => {},
        (data) => {
          setStoredCredentials(data);
        }
      );
    }
  
    // navigation.navigate("History");
  };
  const handleSubmit = () => {
    if (storedCredentials.credits < 20) {
      Alert.alert(
        "Reload Required",
        `Reservation will cost you 20 credit(s).\n\nCurrent balance: ${storedCredentials.credits}\n\nWould you like to proceed to top up your wallet?`,
        [
          {
            text: "No",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => navigation.navigate("Wallet"),
            style: "default",
          },
        ],
        { cancelable: false }
      );
      return;
    }
    Alert.alert(
      "Confirmation",
      `Reserving Court ${courtNo} for 2 hours will cost you 20 credit(s).\n\nAre you sure you want to proceed?`,
      [
        {
          text: "NO",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "CONFIRM",
          onPress: () => {
            if (selectedTime.split("-").length < 2) {
              ToastAndroid.show(
                "Please select a valid slot!",
                ToastAndroid.SHORT
              );
              return;
            }
            let _date = selectedDate;
            _date.setHours(parseInt(selectedTime.split("-")[0]));
            _date.setMinutes(0);
            _date.setSeconds(0);
            _date.setMilliseconds(0);
            data = {
              email: storedCredentials.email,
              court_no: courtNo,
              datetime: selectedDate.toLocaleString("en-US", {
                timeZone: "Asia/Kuala_Lumpur",
              }),
            };
            postReservation(data, setSubmitting, handleMessage);
          },
        },
      ]
    );
  };

  const handleDateTimeChange = (date, time) => {
    console.log("selected Date!!", date);

    if (!date || !time) {
      return;
    }

    // Get the first available time slot for the new selected date
    const firstAvailableSlot = generateTimeSlots(date).find(
      (slot) => slot.isSelectable
    );

    // Set the selected time to the first available time slot, if available
    setSelectedTime(firstAvailableSlot ? firstAvailableSlot.value : "");

    console.log("selected Time!!", time);

    let _date = date;
    _date.setHours(parseInt(time.split("-")[0]));
    _date.setMinutes(0);
    _date.setSeconds(0);
    _date.setMilliseconds(0);
    data = {
      datetime: _date.toLocaleString("en-US", {
        timeZone: "Asia/Kuala_Lumpur",
      }),
    };

    listUnavailableCourts(
      data,
      (sub) => {},
      handleMessage,
      setUnAvailableCourtNo
    );
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    setSelectedDate(date);
    handleDateTimeChange(date, selectedTime);
  };

  const increaseDate = () => {
    const newDate = moment(selectedDate).add(1, "day").toDate();
    setSelectedDate(newDate);
    handleDateTimeChange(newDate, selectedTime);
  };

  const decreaseDate = () => {
    if (!isToday) {
      const newDate = moment(selectedDate).subtract(1, "day").toDate();
      setSelectedDate(newDate);
      handleDateTimeChange(newDate, selectedTime);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Fetch the updated available courts here
      // You can reuse the logic from your existing code to fetch and update the available courts
      // For example, you can call your listUnavailableCourts function
      const data = {
        datetime: selectedDate.toLocaleString("en-US", {
          timeZone: "Asia/Kuala_Lumpur",
        }),
      };
      listUnavailableCourts(
        data,
        (sub) => {},
        handleMessage,
        setUnAvailableCourtNo
      );
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, [selectedDate]); // Make sure to include any dependencies that are used inside the setInterval callback

  useEffect(() => {
    const updateReservationData = () => {
      // Set the default selected time to the first available slot
      const firstAvailableSlot = timeSlots.find((slot) => slot.isSelectable);

      if (firstAvailableSlot) {
        setSelectedTime(firstAvailableSlot.value);
      }

      const initialCheckedStates = courts.map(
        (court) => court.status === "booked" || court.status === "locked"
      );

      setCheckedStates(initialCheckedStates);

      setTimeSlots(generateTimeSlots());

      handleDateTimeChange(selectedDate, selectedTime);
    };

    updateReservationData();
  }, [selectedDate]);

  useEffect(() => {
    // Set the default selected time to the first available slot
    const firstAvailableSlot = timeSlots.find((slot) => slot.isSelectable);

    if (firstAvailableSlot) {
      setSelectedTime(firstAvailableSlot.value);
    }

    const initialCheckedStates = courts.map(
      (court) => court.status === "booked" || court.status === "locked"
    );

    setCheckedStates(initialCheckedStates);

    handleDateTimeChange(selectedDate, selectedTime);
  }, [timeSlots]);

  function generateTimeSlots() {
    const currentTime = new Date().getHours();

    const today_date = new Date();

    // console.log("today_date", today_date, today_date.getTime());
    // console.log("selected_date", selectedDate, selectedDate.getTime());

    const availableSlots = [
      { start: 9, end: 11 },
      { start: 11, end: 13 },
      { start: 13, end: 15 },
      { start: 15, end: 17 },
      { start: 17, end: 19 },
      { start: 19, end: 21 },
      { start: 21, end: 23 },
    ];

    let tempSLots = [];

    if (selectedDate > today_date) {
      tempSLots = availableSlots;
    } else {
      availableSlots.forEach((s) => {
        if (selectedDate > today_date || currentTime < s.end) {
          tempSLots.push(s);
        }
      });
    }

    const slots = tempSLots.map((slot) => ({
      label: `${slot.start}:00 - ${slot.end}:00`,
      value: `${slot.start}-${slot.end}`,
      isSelectable: true,
    }));

    // console.log(slots);

    return slots;
  }

  const handleTimeChange = (value) => {
    handleDateTimeChange(selectedDate, value);
    setSelectedTime(value);
  };

  function generateCourts() {
    // Generate an array of courts with initial status
    const initialCourts = Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      status: "available", // You can customize the status as needed
    }));

    return initialCourts;
  }

  const handleCheckboxChange = (index, value) => {
    const newCheckedStates = [];

    newCheckedStates[index - 1] = value;
    setCheckedStates(newCheckedStates);
    setCourtNo(index);
    newCheckedStates;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dayText}>{moment(selectedDate).format("dddd")}</Text>
      <View style={styles.dateControlContainer}>
        <DateTimePickerModal
          minimumDate={new Date()}
          date={selectedDate}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <TouchableOpacity
          style={[styles.dateControlButton, isToday && styles.disabledButton]}
          onPress={decreaseDate}
          disabled={isToday}
        >
          <Ionicons name="caret-back-outline" />
        </TouchableOpacity>
        <TouchableOpacity style={StyledContainer} onPress={showDatePicker}>
          <Text style={styles.time}>
            {moment(selectedDate).format("MMMM D, YYYY")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateControlButton}
          onPress={increaseDate}
        >
          <Ionicons name="caret-forward-outline" />
        </TouchableOpacity>

        <Picker
          selectedValue={selectedTime}
          onValueChange={handleTimeChange}
          style={styles.picker}
        >
          {timeSlots.map((slot) => (
            <Picker.Item
              key={slot.value}
              label={slot.isSelectable ? slot.label : null}
              value={slot.isSelectable ? slot.value : null}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.walletContainer}>
        <Ionicons
          name="wallet"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("Wallet");
          }}
        />
        <Text style={styles.walletText}>
          {storedCredentials.credits} Credit(s)
        </Text>
      </View>

      <View style={styles.courtBoxesContainer}>
        <View style={styles.court}>
          <Text style={styles.courtText}>Court 1</Text>
          <CheckBox
            style={styles.checkbox}
            disabled={unAvailableCourtNo.filter((u) => u == 1).length > 0}
            value={checkedStates[0]}
            onValueChange={(value) => handleCheckboxChange(1, value)}
          />
          <Text
            style={{
              color:
                unAvailableCourtNo.filter((u) => u == 1).length > 0
                  ? "red"
                  : "teal",
            }}
          >
            {unAvailableCourtNo.filter((u) => u == 1).length > 0
              ? "Reserved"
              : "Available"}
          </Text>
        </View>

        <View style={styles.court}>
          <Text style={styles.courtText}>Court 2</Text>
          <CheckBox
            style={styles.checkbox}
            disabled={unAvailableCourtNo.filter((u) => u == 2).length > 0}
            value={checkedStates[1]}
            onValueChange={(value) => handleCheckboxChange(2, value)}
          />

          <Text
            style={{
              color:
                unAvailableCourtNo.filter((u) => u == 2).length > 0
                  ? "red"
                  : "teal",
            }}
          >
            {unAvailableCourtNo.filter((u) => u == 2).length > 0
              ? "Reserved"
              : "Available"}
          </Text>
        </View>

        <View style={styles.court}>
          <Text style={styles.courtText}>Court 3</Text>
          <CheckBox
            style={[
              styles.checkbox,
              unAvailableCourtNo.filter((u) => u === 3).length > 0 &&
                styles.disabledCheckbox,
            ]}
            disabled={unAvailableCourtNo.filter((u) => u == 3).length > 0}
            value={checkedStates[2]}
            onValueChange={(value) => handleCheckboxChange(3, value)}
          />
          <Text
            style={{
              color:
                unAvailableCourtNo.filter((u) => u == 3).length > 0
                  ? "red"
                  : "teal",
            }}
          >
            {unAvailableCourtNo.filter((u) => u == 3).length > 0
              ? "Reserved"
              : "Available"}
          </Text>
        </View>
      </View>

      <View style={{ ...styles.courtBoxesContainer, marginTop: 60 }}>
        <View style={styles.court}>
          <Text style={styles.courtText}>Court 4</Text>
          <CheckBox
            style={styles.checkbox}
            disabled={unAvailableCourtNo.filter((u) => u == 4).length > 0}
            value={checkedStates[3]}
            onValueChange={(value) => handleCheckboxChange(4, value)}
          />
          <Text
            style={{
              color:
                unAvailableCourtNo.filter((u) => u == 4).length > 0
                  ? "red"
                  : "teal",
            }}
          >
            {unAvailableCourtNo.filter((u) => u == 4).length > 0
              ? "Reserved"
              : "Available"}
          </Text>
        </View>

        <View style={styles.court}>
          <Text style={styles.courtText}>Court 5</Text>
          <CheckBox
            style={styles.checkbox}
            disabled={unAvailableCourtNo.filter((u) => u == 5).length > 0}
            value={checkedStates[4]}
            onValueChange={(value) => handleCheckboxChange(5, value)}
          />
          <Text
            style={{
              color:
                unAvailableCourtNo.filter((u) => u == 5).length > 0
                  ? "red"
                  : "teal",
            }}
          >
            {unAvailableCourtNo.filter((u) => u == 5).length > 0
              ? "Reserved"
              : "Available"}
          </Text>
        </View>

        <View style={styles.court}>
          <Text style={styles.courtText}>Court 6</Text>
          <CheckBox
            style={styles.checkbox}
            disabled={unAvailableCourtNo.filter((u) => u == 6).length > 0}
            value={checkedStates[5]}
            onValueChange={(value) => handleCheckboxChange(6, value)}
          />
          <Text
            style={{
              color:
                unAvailableCourtNo.filter((u) => u == 6).length > 0
                  ? "red"
                  : "teal",
            }}
          >
            {unAvailableCourtNo.filter((u) => u == 6).length > 0
              ? "Reserved"
              : "Available"}
          </Text>
        </View>
      </View>
      {!isSubmitting && checkedStates.some((isChecked) => isChecked) && (
        <StyledButtonRes onPress={handleSubmit}>
          <ButtonText>Book</ButtonText>
        </StyledButtonRes>
      )}

      {!isSubmitting && !checkedStates.some((isChecked) => isChecked) && (
        <StyledButtonRes disabled={true} style={{ backgroundColor: "gray" }}>
          <ButtonText style={{ color: "white" }}>Book</ButtonText>
        </StyledButtonRes>
      )}

      {isSubmitting && (
        <StyledButtonRes disabled={true}>
          <ActivityIndicator size="large" color={primary} />
        </StyledButtonRes>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    backgroundColor: "#a9a9a9",
    width: "100%",
    height: "13%",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: -50,
  },
  time: {
    fontSize: 17,
  },
  dateControlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -20,
  },
  dateControlButton: {
    padding: 10,
    backgroundColor: "#eee",
  },
  disabledButton: {
    opacity: 0.5,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#eee",
    flex: 1,
    alignItems: "center",
  },
  dropDownContainer: {
    height: 40,
    width: 200,
    marginBottom: 20,
  },
  dropDownStyle: {
    backgroundColor: "#fafafa",
  },
  dropDownItemStyle: {
    justifyContent: "flex-start",
  },
  picker: {
    width: 200,
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -10,
  },
  walletText: {
    marginLeft: 5, // Adjust the margin as needed
    fontSize: 16,
    color: "black", // Add your preferred text color
  },
  court: {
    marginTop: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  courtText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  courtBoxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    marginBottom: -10,
  },
  checkbox: {
    marginLeft: 22,
    marginRight: 22,
    width: 80,
    height: 80,
    backgroundColor: "#008000",
  },
  disabledCheckbox: {},
  checkboxText: {
    fontSize: 24,
    marginTop: 10,
  },
});

export default Reservation;
