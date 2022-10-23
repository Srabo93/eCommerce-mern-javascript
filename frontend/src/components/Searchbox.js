import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, InputLeftElement, Input, Button } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

const Searchbox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const searchHandler = (e) => {
    if (keyword === "") {
      return;
    }
    keyword.trim();
    navigate(`/search/${keyword}`);
    setKeyword("");
  };

  return (
    <>
      <InputGroup size="sm" display="flex" flexDir="col">
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="gray.300" />}
        />
        <Input
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search Product"
          value={keyword}
        />
        <Button
          mx={2}
          variant="solid"
          color="black"
          size="sm"
          onClick={searchHandler}
        >
          Search
        </Button>
      </InputGroup>
    </>
  );
};

export default Searchbox;
