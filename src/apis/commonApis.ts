import axiosClient from "./axiosClient";

const commonApis = {
  preUploadFile: (formData: {}) =>
    axiosClient.post(`/api/common/create-presigned-url`, formData),
  uploadFile: ({ urlUpload, file }: {urlUpload: any, file: string}) => {
    return fetch(urlUpload, {
      method: "PUT",
      body: file,
    });
  },
};

export default commonApis;
