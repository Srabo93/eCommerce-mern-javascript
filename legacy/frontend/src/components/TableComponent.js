import React from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const TableComponent = ({ data }) => {
  const { orders, ordersError, loadingError, ordersLoading, isSuccess } = data;
  let tBody;

  if (ordersLoading) {
    tBody = (
      <Tr>
        <Td>
          <Loader />
        </Td>
      </Tr>
    );
  } else if (isSuccess) {
    tBody = orders.map((order) => (
      <Tr key={order._id}>
        <Td p={2}>{order._id.substring(0, 5)}</Td>
        <Td p={2}>{order.createdAt.substring(0, 10)}</Td>
        <Td p={2} isNumeric>
          ${order.totalPrice}
        </Td>
        <Td textAlign="center" p={2}>
          {order.isPaid ? (
            order.paidAt.substring(0, 10)
          ) : (
            <CloseIcon color="red" />
          )}
        </Td>
        <Td textAlign="center" p={2}>
          {order.isDelivered ? (
            order.deliveredAt.substring(0, 10)
          ) : (
            <CloseIcon color="red" />
          )}
        </Td>
        <Td p={2}>
          <Link to={`/orders/${order._id}`}>
            <Button>Details</Button>
          </Link>
        </Td>
      </Tr>
    ));
  } else if (loadingError) {
    tBody = (
      <Tr>
        <Td>
          <Message status="error" message={ordersError} />;
        </Td>
      </Tr>
    );
  }

  return (
    <TableContainer maxW={["80vw", "90vw", "95vw"]}>
      <Table variant="simple" size="small">
        <TableCaption>All purchased Orders</TableCaption>
        <Thead>
          <Tr>
            <Th p={2}>ID</Th>
            <Th p={2}>DATE</Th>
            <Th p={2} isNumeric>
              TOTAL
            </Th>
            <Th p={2} textAlign="center">
              PAID
            </Th>
            <Th p={2}>DELIVERED</Th>
            <Th p={2}></Th>
          </Tr>
        </Thead>
        <Tbody>{tBody}</Tbody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
