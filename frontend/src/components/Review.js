import React from "react";
import { Box, Text, Divider } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const Review = ({ review }) => {
  return (
    <Box pt={2}>
      <Text>{review.name}</Text>
      {Array(5)
        .fill("")
        .map((_, i) => (
          <StarIcon
            as="div"
            key={i}
            boxSize={[3, 4, 5]}
            color={i < review.rating ? "teal.500" : "gray.300"}
          />
        ))}
      <Text py={2}>{review.createdAt.substring(0, 10)}</Text>
      <Text py={2}>{review.comment}</Text>
      <Divider />
    </Box>
  );
};

export default Review;
