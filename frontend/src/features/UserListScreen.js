import React from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetUsersQuery, useDeleteUserMutation } from "./services/user";
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
  Container,
} from "@chakra-ui/react";
import { CloseIcon, CheckIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

const UserListScreen = () => {
  const [deleteUser] = useDeleteUserMutation();

  const {
    data: users,
    isSuccess,
    isLoading,
    isError,
    error,
    refetch: refetchUsers,
  } = useGetUsersQuery();

  let tBody;

  const deleteHandler = async (id) => {
    await deleteUser(id);
    await refetchUsers();
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
          <Link to={`/admin/user/${user._id}/edit`}>
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
    tBody = (
      <Tr>
        <Td>
          <Message status="error" message={error.data.message} />;
        </Td>
      </Tr>
    );
  }

  return (
    <Container maxW="full">
      <Heading py={3} as="h2" mr="auto">
        USERS
      </Heading>
      <TableContainer maxW="100vw">
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
    </Container>
  );
};

export default UserListScreen;
