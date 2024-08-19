import QRCode from "qrcode";

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

export const getImageBase64FromSvgComponent = async (image) => {
  return new Promise((resolve, reject) => {
    fetch(image)
      .then((response) => response.text())
      .then((svgContent) => {
        const base64Svg = btoa(svgContent);
        resolve(base64Svg);
      })
      .catch(reject);
  });
};

export const affixTextOnImage = async (base64, data) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Set text properties
        ctx.font = "60px Inter"; // Font size and type
        ctx.fillStyle = "black"; // Text color
        ctx.textAlign = "center"; // Text alignment

        const maxWidth = canvas.width - 400; // Max width of the text, leaving some padding
        const lineHeight = 80; // Height of each line

        // Function to wrap text
        const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
          const words = text.split(" ");
          let line = "";
          const lines = [];

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              lines.push(line);
              line = words[n] + " ";
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          // Adjust the startY position to center the text block vertically
          const startY = y - (lines.length * lineHeight) / 2;

          // Draw each line
          for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], x, startY + i * lineHeight);
          }
        };

        // Position for the first line
        const nameXPosition = canvas.width / 2;
        const nameYPosition = canvas.height / 2 - 20;

        // Wrap the name text
        wrapText(ctx, data?.name, nameXPosition, nameYPosition, maxWidth, lineHeight);

        // Set text properties for the second line (SCN NO.)
        ctx.font = "40px Inter"; // Bold font, 40px size

        // Position for the second line
        const scnYPosition = nameYPosition + 80;
        ctx.fillText(`SCN NO. ${data?.number}`, canvas.width / 2, scnYPosition);

        // Generate the QR code as a data URL
        const qrCodeDataUrl = await QRCode.toDataURL(data?.qrCode, { width: 200, margin: 0 });

        // Create a new image element for the QR code
        const qrCodeImg = new Image();
        qrCodeImg.onload = () => {
          // Position the QR code just above the nameYPosition
          const qrCodeXPosition = canvas.width / 2 - qrCodeImg.width / 2;
          const qrCodeYPosition = nameYPosition - qrCodeImg.height - 150;

          // Draw the QR code onto the canvas
          ctx.drawImage(qrCodeImg, qrCodeXPosition, qrCodeYPosition);

          // Get the new base64 image without the data URL prefix
          const finalBase64 = canvas.toDataURL("image/png").split(",")[1];
          resolve(finalBase64);
        };
        qrCodeImg.onerror = (err) => {
          reject(new Error(`Failed to load the QR code image: ${err}`));
        };
        qrCodeImg.src = qrCodeDataUrl;
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };

    img.onerror = (err) => {
      reject(new Error(`Failed to load the image: ${err}`));
    };

    // Set the image source to the base64 string
    img.src = `data:image/png;base64,${base64}`;
  });
};
