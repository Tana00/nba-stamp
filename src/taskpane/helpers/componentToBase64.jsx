// import { Buffer } from "buffer";
import ReactDOMServer from "react-dom/server";

// Function to convert SVG to Base64
// const svgToBase64 = (svg) => {
//   return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
// };

export function svgToBase64(svgString) {
  const encodedSVG = encodeURIComponent(svgString);
  return `data:image/svg+xml;base64,${btoa(encodedSVG)}`;
}

// Function to get Base64 from SVG component
export const getSvgBase64 = (component) => {
  const svgString = ReactDOMServer.renderToStaticMarkup(component);
  return svgToBase64(svgString);
};

function createBlobFromSVG(svgString) {
  // Create a Blob from the SVG string with MIME type 'image/svg+xml'
  return new Blob([svgString], { type: "image/svg+xml" });
}

function getBase64FromBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Event handler when reading is completed
    reader.onloadend = () => {
      // Extract the Base64 part from the data URL
      const base64 = reader.result?.toString().split(",")[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error("Failed to convert Blob to Base64"));
      }
    };

    // Error handling
    reader.onerror = reject;

    // Read the Blob as a data URL
    reader.readAsDataURL(blob);
  });
}

export async function svgComponentToBase64(svgString) {
  // Step 1: Get SVG string from component
  //   const svgString = getSVGString(data);

  // Step 2: Create Blob from SVG string
  const blob = createBlobFromSVG(svgString);

  // Step 3: Convert Blob to Base64
  return await getBase64FromBlob(blob);
}
