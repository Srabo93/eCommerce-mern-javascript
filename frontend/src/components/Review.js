import React from "react";
import { Box, Text, Divider } from "@chakra-ui/react";
import ReviewStars from "./ReviewStars";

const Review = ({ review }) => {
  return (
    <Box pt={2}>
      <Text>{review.name}</Text>
      <ReviewStars rating={review.rating} />
      <Text py={2}>{review.createdAt.substring(0, 10)}</Text>
      <Text py={2}>{review.comment}</Text>
      <Divider />
    </Box>
  );
};

export default Review;
