import React from "react";
import { StarIcon } from "@chakra-ui/icons";

const ReviewStars = ({ rating }) => {
  if (rating < 0) {
    throw new Error("Rating must be a positive integer");
  }
  if (rating > 5) {
    throw new Error("Rating cant be larger than 5");
  }
  return (
    <>
      {Array(5)
        .fill("")
        .map((_, i) => (
          <StarIcon
            as="div"
            role="review stars"
            key={i}
            boxSize={[3, 4, 5]}
            color={i < rating ? "teal.500" : "gray.300"}
            data-filled={i < rating ? true : false}
          />
        ))}
    </>
  );
};

export default ReviewStars;
