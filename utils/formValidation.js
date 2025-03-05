export const validateReportForm = (description, address, plate, images) => {
  let valid = true;
  let errors = {
    descriptionError: "",
    addressError: "",
    plateError: "",
    imagesError: "",
  };

  if (!description) {
    errors.descriptionError = "Description is required";
    valid = false;
  }

  if (!address) {
    errors.addressError = "Address is required";
    valid = false;
  }

  if (!plate) {
    errors.plateError = "Plate number is required";
    valid = false;
  }

  if (images.length !== 4) {
    errors.imagesError = "Exactly four images are required";
    valid = false;
  }

  return { valid, errors };
};

export const validateObsForm = (description, address) => {
  let valid = true;
  let errors = {
    descriptionError: "",
    addressError: "",
  };

  if (!description) {
    errors.descriptionError = "Description is required";
    valid = false;
  }

  if (!address) {
    errors.addressError = "Address is required";
    valid = false;
  }

  return { valid, errors };
};