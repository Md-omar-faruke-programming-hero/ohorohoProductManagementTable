import axios from "axios";

const IMAGE_BB_API_KEY = "0be8e51137bb624f510498600ad10aba";

export const uploadToImageBB = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMAGE_BB_API_KEY}`,
    formData
  );

  console.log(response)

  return response.data.data.url;
};
