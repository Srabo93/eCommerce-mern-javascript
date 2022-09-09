import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPaymentMethod } from "./cartSlice";
import CheckOutSteps from "../components/CheckOutSteps";
import Message from "../components/Message";
import {
  Box,
  Radio,
  RadioGroup,
  Heading,
  Button,
  Text,
} from "@chakra-ui/react";

const PaymentScreen = () => {
  const [payMethod, setPayMethod] = useState(null);
  const [formError, setFormError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = () => {
    if (payMethod === null || undefined) {
      setFormError("A Payment Method has to be ticked");
      return;
    }
    dispatch(addPaymentMethod(payMethod));
    setFormError(null);
    navigate("/placeorder");
  };

  return (
    <Box
      maxW="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="start"
    >
      <CheckOutSteps step1 step2 step3 />
      {formError ? <Message error={formError} /> : ""}
      <Heading mb={3} as="h2">
        Payment Method
      </Heading>
      <Text mb={3} as="em">
        Select Method
      </Text>
      <RadioGroup mb={8} onChange={setPayMethod} value={payMethod}>
        <Radio value="PayPal">Paypal</Radio>
      </RadioGroup>
      <Button w="full" mb={3} onClick={submitHandler}>
        Continue
      </Button>
    </Box>
  );
};

export default PaymentScreen;
