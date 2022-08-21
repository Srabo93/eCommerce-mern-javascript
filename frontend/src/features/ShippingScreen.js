import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addShipping } from "./cartSlice";
import { useDispatch } from "react-redux";
import CheckOutSteps from "../components/CheckOutSteps";
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Heading,
  Button,
  Box,
} from "@chakra-ui/react";

const ShippingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formErrors, setFormErrors] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const validInputs = [
    shippingInfo.address,
    shippingInfo.city,
    shippingInfo.postalCode,
    shippingInfo.country,
  ].every(String);

  const submitHandler = () => {
    if (!validInputs) {
      setFormErrors(true);
      return;
    }
    dispatch(addShipping(shippingInfo));
    setFormErrors(false);
    navigate("/payment");
  };

  return (
    <Box
      maxW="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <FormControl isRequired>
        <CheckOutSteps step1 step2 />
        <Heading mb={3} as="h2">
          Shipping
        </Heading>
        <FormLabel id="address">Address</FormLabel>
        <Input
          id="address"
          mb={2}
          type="text"
          placeholder="Enter Address"
          value={shippingInfo.address}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, address: e.target.value })
          }
        />
        {formErrors ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
        <FormLabel id="city">Enter City</FormLabel>
        <Input
          id="city"
          mb={2}
          type="text"
          placeholder="Enter City"
          value={shippingInfo.city}
          onChange={(e) =>
            setShippingInfo({ ...shippingInfo, city: e.target.value })
          }
        />
        {formErrors ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
        <FormLabel id="postalCode">Postal Code</FormLabel>
        <Input
          id="postalCode"
          mb={3}
          type="text"
          placeholder="Enter Postal Code"
          value={shippingInfo.postalCode}
          onChange={(e) =>
            setShippingInfo({
              ...shippingInfo,
              postalCode: e.target.value,
            })
          }
        />
        {formErrors ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
        <FormLabel id="country">Country</FormLabel>
        <Input
          id="country"
          mb={3}
          type="text"
          placeholder="Enter Country"
          value={shippingInfo.country}
          onChange={(e) =>
            setShippingInfo({
              ...shippingInfo,
              country: e.target.value,
            })
          }
        />
        {formErrors ? (
          <FormHelperText pb={3}>Field cant be empty!</FormHelperText>
        ) : (
          ""
        )}
        <Button w="full" mb={3} type="submit" onClick={submitHandler}>
          Continue
        </Button>
      </FormControl>
    </Box>
  );
};

export default ShippingScreen;
