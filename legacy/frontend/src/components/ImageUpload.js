import React, { useEffect, useState } from "react";
import { useUploadImageMutation } from "../features/services/products";
import { Box, Button, Image, Input } from "@chakra-ui/react";
import Loader from "../components/Loader";

const ImageUpload = ({ id, productInfo }) => {
  const [imgUpload, setImgUpload] = useState(null);
  const [img, setImg] = useState("");

  const [
    uploadImage,
    { isLoading: uploadLoading, isSuccess: uploadSuccess, data },
  ] = useUploadImageMutation();

  useEffect(() => {
    if (uploadSuccess) {
      setImg(data.path);
    }
    return () => {};
  }, [uploadSuccess]);

  const uploadhandler = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("uploadedImg", imgUpload);
    form.append("id", id);

    try {
      await uploadImage(form);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      {uploadLoading ?? <Loader />}
      <Image
        my={3}
        boxSize="150px"
        objectFit="cover"
        src={img}
        fallbackSrc={productInfo?.image}
      />
      <form
        encType="multipart/form-data"
        method="post"
        onSubmit={uploadhandler}
      >
        <input type="text" hidden defaultValue={id} />

        <Input
          type="file"
          name="uploadedImg"
          borderStyle="none"
          onChange={(e) => setImgUpload(e.target.files[0])}
        />
        <Button size="sm" my={2} type="submit">
          Upload
        </Button>
      </form>
    </Box>
  );
};

export default ImageUpload;
