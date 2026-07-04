import React from "react";
import {Link} from "react-router-dom";
import {useGetOrdersQuery} from "../features/services/orders";
import {
    Button,
    Container,
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {CheckIcon, CloseIcon, EditIcon} from "@chakra-ui/icons";
import Loader from "../components/Loader";
import Message from "../components/Message";

const OrdersListScreen = () => {
    const {data: orders, isLoading, isError, error} = useGetOrdersQuery();

    let tBody;

    tBody = orders?.map((order) => (
        <Tr key={order._id}>
            <Td p={2}>{order._id}</Td>
            <Td p={2}>{order.user.name}</Td>
            <Td p={2}>{order.createdAt.substring(0, 10)}</Td>
            <Td p={2}>${order.totalPrice}</Td>
            <Td p={2} textAlign="center">
                {order.isPaid ? <CheckIcon color="green"/> : <CloseIcon color="red"/>}
            </Td>
            <Td p={2} textAlign="center">
                {order.isDelivered ? (
                    <CheckIcon color="green"/>
                ) : (
                    <CloseIcon color="red"/>
                )}
            </Td>
            <Td p={2}>
                <Link to={`/orders/${order._id}`}>
                    <Button m={1}>
                        <EditIcon/>
                    </Button>
                </Link>
            </Td>
        </Tr>
    ));

    return (
        <Container maxW="full">
            <Heading py={3} as="h2" mr="auto">
                ORDERS
            </Heading>
            {isLoading && <Loader/>}
            {isError && <Message status="error" message={error.data.message}/>}
            <TableContainer maxW="100vw">
                <Table variant="simple" size="small">
                    <TableCaption>All Orders</TableCaption>
                    <Thead>
                        <Tr>
                            <Th p={2}>ID</Th>
                            <Th p={2}>USER</Th>
                            <Th p={2}>DATE</Th>
                            <Th p={2}>TOTAL</Th>
                            <Th p={2}>PAID</Th>
                            <Th p={2}>DELIVERED</Th>
                            <Th p={2}>DETAILS</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{tBody}</Tbody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default OrdersListScreen;
