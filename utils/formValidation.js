export const validateReportForm = (
  description,
  address,
  images,
  exactLocation
) => {
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

  // if (!plate) {
  //   errors.plateError = "Plate number is required";
  //   valid = false;
  // }
  if (exactLocation === "") {
    errors.exactLocationError = "Exact location is required";
    valid = false;
  }

  if (images.length !== 3) {
    errors.imagesError = "Exactly three images are required";
    valid = false;
  }

  return { valid, errors };
};

export const validateObsForm = (description, address, images) => {
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
  if (images.length !== 2) {
    errors.imagesError = "Exactly two images are required";
    valid = false;
  }

  return { valid, errors };
};

export const validateEditProfileForm = (
  firstName,
  lastName,
  phoneNumber,
  address,
  avatar
) => {
  let valid = true;
  let errors = {
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: "",
    addressError: "",
    avatarError: "",
  };

  if (!firstName) {
    errors.firstNameError = "First name is required";
    valid = false;
  }

  if (!lastName) {
    errors.lastNameError = "Last name is required";
    valid = false;
  }

  if (phoneNumber.length !== 11) {
    errors.phoneNumberError = "Phone number is needed to be 11 digits";
    valid = false;
  }

  if (!address) {
    errors.addressError = "Address is required";
    valid = false;
  }

  if (!avatar) {
    errors.avatarError = "Avatar is required";
    valid = false;
  }

  return { valid, errors };
};
