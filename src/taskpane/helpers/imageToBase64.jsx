export async function getImageBase64FromLocalPath(imagePath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result.split(",")[1]); // Remove data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open("GET", imagePath);
    xhr.responseType = "blob";
    xhr.send();
  });
}
