import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useGetUserByIdQuery, useUpdateUserByIdMutation,} from "../../features/services/user";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {Box, Button, Checkbox, FormControl, FormLabel, Heading, Input,} from "@chakra-ui/react";

const UserEditScreen = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [
        updateUser,
        {
            isSuccess: updateSuccess,
            isError: updateError,
            error: updateErrorMessage,
        },
    ] = useUpdateUserByIdMutation();

    const {
        data: user,
        isLoading: userLoading,
        isError: userError,
        error: userErrorMessage,
    } = useGetUserByIdQuery(id);

    const [userCredentials, setUserCredentials] = useState({
        name: "",
        email: "",
        isAdmin: false,
    });

    useEffect(() => {
        if (user) {
            setUserCredentials({
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        }

        return () => {
        };
    }, [user]);

    let status;

    if (userLoading) {
        status = <Loader/>;
    }
    if (userError) {
        status = (
            <Message m={3} status="error" message={userErrorMessage.data.message}/>
        );
    }
    if (updateError) {
        status = (
            <Message m={3} status="error" message={updateErrorMessage.data.message}/>
        );
    }
    if (updateSuccess) {
        status = <Message m={3} status="success" message={"User got updated!"}/>;
    }

    const submitHandler = async () => {
        try {
            await updateUser({id, userCredentials});
            navigate("/admin/userlist");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box
            maxW="lg"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            {status}
            <FormControl isRequired>
                <Heading mb={3} as="h2">
                    Edit User
                </Heading>
                <FormLabel id="name">Name</FormLabel>
                <Input
                    id="name"
                    mb={2}
                    type="text"
                    value={userCredentials.name}
                    onChange={(e) =>
                        setUserCredentials({...userCredentials, name: e.target.value})
                    }
                />

                <FormLabel id="email">Email address</FormLabel>
                <Input
                    id="email"
                    mb={2}
                    type="email"
                    value={userCredentials.email}
                    onChange={(e) =>
                        setUserCredentials({...userCredentials, email: e.target.value})
                    }
                />
                <Checkbox
                    my={2}
                    isChecked={userCredentials.isAdmin}
                    onChange={(e) =>
                        setUserCredentials({
                            ...userCredentials,
                            isAdmin: e.target.checked,
                        })
                    }
                >
                    Admin?{" "}
                </Checkbox>
                <Button w="full" mb={3} type="submit" onClick={submitHandler}>
                    Update User
                </Button>
            </FormControl>
        </Box>
    );
};

export default UserEditScreen;
