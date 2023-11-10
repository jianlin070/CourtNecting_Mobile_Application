// Form handling
// data = {
//   "status": 0,
//   "email": "jianlinlim@gmail.com",
//   "datetime": "2020-05-18T14:10:00Z",
//   "court_no": 3
// }

import { SERVER_IP } from "../../config";
import axios from "axios";

export const postReservation = (data, setSubmitting, handleMessage) => {
  handleMessage(null);
  const url = `http://${SERVER_IP}/reservation/`;
  axios
    .post(url, data)
    .then((response) => {
      const result = response.data;
      const { status, message, error, data } = result;

      if (status !== 200) {
        handleMessage(error, "Failed");
      } else {
        handleMessage(message, "Success");
      }
      setSubmitting(false);
    })
    .catch((error) => {
      setSubmitting(false);
      handleMessage("An error occurred. Check your network and try again");
      console.log(error.toJSON());
    });
};

// Form handling
// data = {
//   "status": 0,
//   "email": "jianlinlim@gmail.com"
// }
export const listReservation = (
  email,
  setSubmitting,
  handleMessage,
  handleData
) => {
  handleMessage(null);
  const url = `http://${SERVER_IP}/reservation/${email}`;
  axios
    .get(url)
    .then((response) => {
      const result = response.data;
      const { status, message, error, data } = result;

      if (status !== 200) {
        handleMessage(error, "Failed");
      } else {
        handleData(data);
      }
      setSubmitting(false);
    })
    .catch((error) => {
      setSubmitting(false);
      handleMessage("An error occurred. Check your network and try again");
      console.log(error.toJSON());
    });
};

// Form handling
// data = {
//   "datetime": "2020-05-18T14:10:00Z"
// }
export const listUnavailableCourts = (
  data,
  setSubmitting,
  handleMessage,
  handleData
) => {
  handleMessage(null);
  const url = `http://${SERVER_IP}/reservation/unavailble-court-no`;
  axios
    .post(url, data)
    .then((response) => {
      const result = response.data;
      const { status, message, error, unavailableCourts } = result;

      if (status !== 200) {
        handleMessage(error, "Failed");
      } else {
        handleData(unavailableCourts);
      }
      setSubmitting(false);
    })
    .catch((error) => {
      setSubmitting(false);
      handleMessage("An error occurred. Check your network and try again");
      console.log(error.toJSON());
    });
};
