import axios from "axios";

const uploadImageToImageBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData
  );

  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("Image upload failed");
  }
};

export default uploadImageToImageBB;
