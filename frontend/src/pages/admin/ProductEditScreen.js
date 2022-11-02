import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useGetProductQuery, useUpdateProductMutation,} from "../../features/services/products";
import Message from "../../components/Message";
import ImageUpload from "../../components/ImageUpload";
import {Box, Button, FormControl, FormLabel, Heading, Input, Stack, Textarea,} from "@chakra-ui/react";

const ProductEditScreen = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data: product, isSuccess} = useGetProductQuery(id);

    const [
        updateProduct,
        {
            isSuccess: updateSuccess,
            isError: updateError,
            error: updateErrorMessage,
        },
    ] = useUpdateProductMutation();

    const [productInfo, setProductInfo] = useState({
        name: "",
        price: 0,
        image: "",
        brand: "",
        countInStock: 0,
        category: "",
        description: "",
    });

    useEffect(() => {
        if (isSuccess) {
            setProductInfo({
                name: product.name,
                price: product.price,
                image: product.image,
                brand: product.brand,
                countInStock: product.countInStock,
                category: product.category,
                description: product.description,
            });
        }

        return () => {
        };
    }, [isSuccess]);

    let status;

    if (updateError) {
        status = (
            <Message m={3} status="error" message={updateErrorMessage.data.message}/>
        );
    }
    if (updateSuccess) {
        status = <Message m={3} status="success" message={"User got updated!"}/>;
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await updateProduct({id, productInfo});
            navigate("/admin/productlist");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box>
            {status}
            <Heading mb={3} as="h2">
                Edit Product
            </Heading>
            <Stack direction={["column", "column", "row"]} spacing="24px">
                <ImageUpload productInfo={productInfo} id={id}/>
                <FormControl isRequired>
                    <FormLabel id="name">Name</FormLabel>
                    <Input
                        id="name"
                        mb={2}
                        type="text"
                        value={productInfo.name}
                        onChange={(e) =>
                            setProductInfo({...productInfo, name: e.target.value})
                        }
                    />

                    <FormLabel id="price">Price</FormLabel>
                    <Input
                        id="price"
                        mb={2}
                        type="number"
                        value={productInfo.price}
                        onChange={(e) =>
                            setProductInfo({...productInfo, price: e.target.value})
                        }
                    />
                    <FormLabel id="image">Image</FormLabel>
                    <Box mb={2}>
                        <Input
                            id="image"
                            mb={2}
                            type="text"
                            disabled
                            value={productInfo.image}
                        />
                    </Box>

                    <FormLabel id="brand">Brand</FormLabel>
                    <Input
                        id="brand"
                        mb={2}
                        type="text"
                        value={productInfo.brand}
                        onChange={(e) =>
                            setProductInfo({...productInfo, brand: e.target.value})
                        }
                    />

                    <FormLabel id="countInStock">Count In Stock</FormLabel>
                    <Input
                        id="countInStock"
                        mb={2}
                        type="text"
                        value={productInfo.countInStock}
                        onChange={(e) =>
                            setProductInfo({...productInfo, countInStock: e.target.value})
                        }
                    />

                    <FormLabel id="category">Category</FormLabel>
                    <Input
                        id="category"
                        mb={2}
                        type="text"
                        value={productInfo.category}
                        onChange={(e) =>
                            setProductInfo({...productInfo, category: e.target.value})
                        }
                    />

                    <FormLabel id="description">Description</FormLabel>
                    <Textarea
                        mb={2}
                        value={productInfo.description}
                        onChange={(e) =>
                            setProductInfo({...productInfo, description: e.target.value})
                        }
                    />

                    <Button
                        w="full"
                        mb={3}
                        type="submit"
                        onClick={(e) => submitHandler(e)}
                    >
                        Update Product
                    </Button>
                </FormControl>
            </Stack>
        </Box>
    );
};

export default ProductEditScreen;
