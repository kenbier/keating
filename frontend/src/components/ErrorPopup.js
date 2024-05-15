import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const ErrorPopup = styled(ToastContainer).attrs({
  // default attributes here
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true
})`
  /* Additional styles */
  .Toastify__toast {
    background: #fff; // example: set the background color of each toast
    border-radius: 8px; // example: round corners
    font-family: Arial, sans-serif; // example: change font
  }
  .Toastify__toast--error {
    background: #f44336; // example: custom background for error messages
  }
  // Add more custom styles if needed
`;

export default ErrorPopup;