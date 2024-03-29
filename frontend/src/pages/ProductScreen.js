import React, {useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useCreateReviewMutation, useGetProductQuery,} from "../features/services/products";
import {selectAuthenticatedUser} from "../features/auth/authSlice";
import {addItem} from "../features/cart/cartSlice";
import Message from "../components/Message";
import Review from "../components/Review";
import CreateReview from "../components/CreateReview";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import ReviewStars from "../components/ReviewStars";
import Meta from "../components/Meta";

const ProductScreen = () => {
    const [qty, setQty] = useState(1);

    let {id} = useParams();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const {isAuthenticated} = useSelector(selectAuthenticatedUser);

    const {data: product} = useGetProductQuery(id);

    const [createReview, {isError, error}] = useCreateReviewMutation(id);

    const addReviewHandler = async (reviewData) => {
        try {
            await createReview({id, reviewData});
        } catch (error) {
            console.log(error);
        }
    };

    const addToCartHandler = (product) => {
        let subtotal = Number(product.price * qty);
        dispatch(addItem({product, qty, subtotal}));
        navigate(`/cart/${id}`);
    };

    return (
        <>
            <Meta title={product?.name}/>
            <Container maxW="full">
                <Link to="/">
                    <Button variant="ghost" color="teal">
                        Go Back
                    </Button>
                </Link>
                <SimpleGrid mt={5} columns={{base: 1, lg: 3}} spacing={[2, 5, 10]}>
                    <Image src={product?.image} alt={product?.image}/>
                    <VStack alignItems="flex-start">
                        <Heading as="h3" fontSize={["md", "xl", "2xl"]}>
                            {product?.name}
                        </Heading>
                        <Box
                            direction={["column", "column"]}
                            alignItems="flex-end"
                            justifyContent="center"
                        >
                            <ReviewStars rating={product?.rating}/>
                            <Text noOfLines={1} as="p" fontSize={["sm", "md", "lg"]}>
                                {product?.numReviews} reviews
                            </Text>
                        </Box>
                        <Divider/>
                        <Flex flexDir="column">
                            <Text fontWeight="bold" pb={7}>
                                Price: ${product?.price}
                            </Text>
                            <Text>{product?.description}</Text>
                        </Flex>
                    </VStack>
                    <Box textAlign="center">
                        <Divider mt={[8, 2]}/>
                        <HStack justifyContent="space-between" p={2} my={3}>
                            <Text as="p">Price:</Text>
                            <Text as="p">${product?.price}</Text>
                        </HStack>
                        <Divider/>
                        <HStack justifyContent="space-between" p={2} my={3}>
                            <Text as="p">Status:</Text>
                            <Text as="p">
                                {product?.countInStock > 0 ? "In Stock" : "Out of Stock"}
                            </Text>
                        </HStack>
                        {product?.countInStock > 0 && (
                            <Select onChange={(e) => setQty(e.target.value)}>
                                {[...Array(product?.countInStock).keys()].map((count) => (
                                    <option value={count + 1} key={count + 1}>
                                        {count + 1}
                                    </option>
                                ))}
                            </Select>
                        )}
                        <Divider/>
                        <Button
                            w="full"
                            mt={3}
                            disabled={product?.countInStock === 0}
                            onClick={() => addToCartHandler(product)}
                        >
                            Add To Cart
                        </Button>
                    </Box>
                </SimpleGrid>
                <Box my={5}>
                    <Heading as="h3">Reviews</Heading>
                    {product?.reviews.length === 0 && (
                        <Message status="info" message="No Reviews"/>
                    )}
                    {product?.reviews.map((review) => (
                        <Review key={review._id} review={review}/>
                    ))}
                </Box>
                {isAuthenticated && (
                    <Box>
                        {isError && <Message message={error.data.message} status="error"/>}
                        <Heading>Write a Review</Heading>
                        <CreateReview onAddReviewChange={addReviewHandler}/>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default ProductScreen;
