import React, { useState } from "react";
import { Select, Text, Textarea, Button } from "@chakra-ui/react";

const CreateReview = ({ onAddReviewChange }) => {
  const [reviewData, setReviewData] = useState({ rating: 1, comment: "" });

  const validateReview = () => {
    if (reviewData.rating === null || undefined) {
      return;
    }

    onAddReviewChange(reviewData);
    setReviewData({ rating: 1, comment: "" });
  };

  return (
    <>
      <Text mt={1} fontStyle="oblique">
        Rating:
      </Text>
      <Select
        value={reviewData.rating}
        onChange={(e) =>
          setReviewData((prevState) => ({
            ...prevState,
            rating: e.target.value,
          }))
        }
      >
        {[...Array(5).keys()].map((count) => (
          <option value={count + 1} key={count + 1}>
            {count + 1}
          </option>
        ))}
      </Select>
      <Text mt={3} fontStyle="oblique">
        Comment:
      </Text>
      <Textarea
        onChange={(e) =>
          setReviewData((prevState) => ({
            ...prevState,
            comment: e.target.value,
          }))
        }
        value={reviewData.comment}
        placeholder="Leave a Comment about the Product"
      />
      <Button onClick={validateReview} mt={3}>
        Submit
      </Button>
    </>
  );
};

export default CreateReview;
