import React from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
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
  Heading,
} from "@chakra-ui/react";
import { CloseIcon, CheckIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useGetUsersQuery } from "./services/user";

const UserListScreen = () => {
  const {
    data: users,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery();

  let tBody;

  const deleteHandler = (id) => {
    console.log(id);
  };

  if (isLoading) {
    tBody = (
      <Tr>
        <Td>
          <Loader />
        </Td>
      </Tr>
    );
  } else if (isSuccess) {
    tBody = users.map((user) => (
      <Tr key={user._id}>
        <Td p={2}>{user._id}</Td>
        <Td p={2}>{user.name}</Td>
        <Td p={2}>{user.email}</Td>
        <Td textAlign="center" p={2}>
          {user.isAdmin ? (
            <CheckIcon color="green" />
          ) : (
            <CloseIcon color="red" />
          )}
        </Td>
        <Td p={2}>
          <Link to={`/user/${user._id}/edit`}>
            <Button m={1}>
              <EditIcon />
            </Button>
          </Link>
          <Button color="red" m={1} onClick={() => deleteHandler(user._id)}>
            <DeleteIcon />
          </Button>
        </Td>
      </Tr>
    ));
  } else if (isError) {
    tBody = <Message error={error} />;
  }

  return (
    <>
      <Heading py={3} as="h2" mr="auto">
        USERS
      </Heading>
      <TableContainer maxW={["80vw", "90vw", "95vw"]}>
        <Table variant="simple" size="small">
          <TableCaption>All Users</TableCaption>
          <Thead>
            <Tr>
              <Th p={2}>ID</Th>
              <Th p={2}>NAME</Th>
              <Th p={2}>EMAIL</Th>
              <Th p={2} textAlign="center">
                ADMIN
              </Th>
              <Th p={2}></Th>
            </Tr>
          </Thead>
          <Tbody>{tBody}</Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserListScreen;
