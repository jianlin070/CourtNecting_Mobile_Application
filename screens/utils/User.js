import { SERVER_IP } from "../../config";
import axios from "axios";

export const addCredit = (data, handleMessage, handleData) => {
  const url = `http://${SERVER_IP}/user/add-credit`;
  axios
    .post(url, data)
    .then((response) => {
      const result = response.data;
      const { status, data } = result;

      if (status !== 200) {
        handleMessage("Can not add credit", "Failed");
      } else {
        console.log("data >>> ", data);
        handleData(data);
      }
    })
    .catch((error) => {
      handleMessage(
        "An error occurred. Check your network and try again",
        "Failed"
      );
      console.log(error.toJSON());
    });
};

export const removeCredit = (data, handleMessage, handleData) => {
  const url = `http://${SERVER_IP}/user/remove-credit`;
  axios
    .post(url, data)
    .then((response) => {
      const result = response.data;
      const { status, data } = result;

      if (status !== 200) {
        handleMessage("Can not remove credit", "Failed");
      } else {
        console.log("data >>> ", data);
        handleData(data);
      }
    })
    .catch((error) => {
      handleMessage(
        "An error occurred. Check your network and try again",
        "Failed"
      );
      console.log(error.toJSON());
    });
};

// data = { email, new_email, password, name }
export const updateUser = (data, handleMessage, handleData) => {
  const url = `http://${SERVER_IP}/user/${data.email}`;
  axios
    .put(url, data)
    .then((response) => {
      const result = response.data;
      const { status, data, error } = result;
      if (status !== 200 || (error && error.length > 0)) {
        handleMessage(error, "Failed");
      } else {
        console.log("data >>> ", data);
        handleData(data);
      }
    })
    .catch((error) => {
      handleMessage(
        "An error occurred. Check your network and try again",
        "Failed"
      );
      console.log(error.toJSON());
    });
};
