import mime from "mime";

export const setImageUpload = async (images) => {
  const formattedImages = images.map((image) => {
    const newImageUri = "file:///" + image.split("file:/").join("");
    return {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    };
  });
  // console.log(formattedImages);
  return formattedImages;
};

export const setImageUploadOne = async (image) => {
  const newImageUri = "file:///" + image.split("file:/").join("");
  return {
    uri: newImageUri,
    type: mime.getType(newImageUri),
    name: newImageUri.split("/").pop(),
  };
};

export const setFormData = async (values) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
