import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeCart } from "../cart/cartSlice";
import { useSelector } from "react-redux";
import { selectAuthenticatedUser } from "../auth/authSlice";
import {
  useGetOrderQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../services/orders";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ShippingDetails from "../../components/ShippingDetails";
import OrderedItemsList from "../../components/OrderedItemsList";
import OrderSummary from "../../components/OrderSummary";
import {
  Heading,
  Text,
  Grid,
  GridItem,
  Divider,
  VStack,
  Alert,
  AlertIcon,
  Button,
} from "@chakra-ui/react";

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAdmin } = useSelector(selectAuthenticatedUser);

  const {
    data: order,
    refetch,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetOrderQuery(id);

  const [payOrder, { isError: updateFailed, error: updateError }] =
    usePayOrderMutation();

  const [deliverOrder, { isSuccess: deliverySuccess }] =
    useDeliverOrderMutation();

  const deilverOrderHandler = async () => {
    await deliverOrder(id);
    refetch();
  };

  let status;
  if (isLoading) {
    status = <Loader />;
  }
  if (isError) {
    status = <Message m={3} status="error" message={error} />;
  }
  if (updateFailed) {
    status = <Message m={3} status="error" message={updateError} />;
  }

  return (
    <>
      {isSuccess ? (
        <Grid
          mt={6}
          w={["90vw", "100vw", "70vw"]}
          minH="50vh"
          templateRows={["repeat(2, 1fr)", "repeat(2,1fr)", "repeat(1,1fr)"]}
          templateColumns="repeat(6, 1fr)"
          gap={4}
        >
          {status}
          <GridItem
            colSpan={{ base: 6, sm: 6, md: 6, lg: 4 }}
            rowSpan={{ base: 2, sm: 2, md: 2, lg: 1 }}
            p={3}
          >
            <Heading as="h2" size="lg" mb={3}>
              ORDER {order._id}
            </Heading>
            <Divider />
            <Heading as="h2" size="lg" my={3}>
              Shipping
            </Heading>
            <ShippingDetails order={order} />
            <Divider />
            <Heading as="h2" size="lg" my={3}>
              Payment Method
            </Heading>
            <Text mb={3}>Method: {order.paymentMethod}</Text>
            {order.isPaid ? (
              <Alert status="success">
                {" "}
                <AlertIcon />
                Paid on {order.paidAt.substring(0, 10)}
              </Alert>
            ) : (
              <Alert status="error">
                <AlertIcon />
                Not Paid
              </Alert>
            )}
            <Divider />
            <Heading as="h2" size="lg" my={3}>
              Ordered Items
            </Heading>
            <VStack>
              <OrderedItemsList order={order} />
            </VStack>
          </GridItem>
          <GridItem
            colSpan={{ base: 6, sm: 6, md: 6, lg: 2 }}
            rowSpan={{ base: 2, sm: 2, md: 2, lg: 1 }}
            py={3}
          >
            <VStack alignItems="start">
              <Heading as="h2" size="lg" my={3}>
                Order Summary
              </Heading>
              <Divider />
              <OrderSummary order={order} />
              <Divider />
              {isAdmin && (
                <Button
                  w="full"
                  onClick={deilverOrderHandler}
                  disabled={order.isDelivered ? true : false}
                >
                  Mark as Delivered
                </Button>
              )}
              {deliverySuccess && (
                <Message status="success" message="Delivery Success" />
              )}
            </VStack>
            {!order.isPaid && !isAdmin && (
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: order.totalPrice,
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    details.orderId = id;
                    payOrder(details);
                    dispatch(removeCart());
                  });
                }}
              />
            )}
          </GridItem>
        </Grid>
      ) : (
        "Something Went Wrong"
      )}
    </>
  );
};

export default OrderScreen;
