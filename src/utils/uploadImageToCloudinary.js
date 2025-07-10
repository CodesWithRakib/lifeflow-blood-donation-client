import axios from "axios";

const uploadImageToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "codeswithrakib"); // Your unsigned preset name

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUD_NAME
    }/image/upload`,
    formData
  );

  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Image upload to Cloudinary failed");
  }
};

export default uploadImageToCloudinary;
