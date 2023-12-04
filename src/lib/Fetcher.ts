import axios from "axios";

const fetcher = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export function sendXmlHttpRequest(
  endpoint: string,
  data: any,
  header: {
    [key: string]: string | string[] | undefined;
  }
) {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = e => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(JSON.parse(xhr.responseText));
      }
    };
    xhr.open("POST", process.env.EXPO_PUBLIC_API_URL + endpoint);

    Object.keys(header).forEach(key => {
      if (header[key]) {
        xhr.setRequestHeader(key, header[key] as string);
      }
    });
    xhr.setRequestHeader("Content-Type", "multipart/form-data");

    xhr.send(data);
  });
}

export default fetcher;
