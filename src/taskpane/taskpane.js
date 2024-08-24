/* global Word Office */
import { useAuthStore } from "./store";

import { getImageBase64FromLocalPath } from "./helpers/imageToBase64";

const placeholderImagePath = "../../assets/gray-stamp.png";
const placeholderFooterImagePath = "../../assets/footer-gray-stamp.png";
// const originalImagePath = "../../assets/original-stamp.pngote";
// const originalFooterImagePath = "../../assets/footer-stamp.png";

export async function insertText(text) {
  // Write text to the document.
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      body.insertParagraph(text, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function insertImageBottomRightFromLocalPath(totalPages) {
  try {
    const imageBase64 = await getImageBase64FromLocalPath(placeholderImagePath);
    const footerImageBase64 = await getImageBase64FromLocalPath(placeholderFooterImagePath);

    // const { base64Stamps } = useAuthStore.getState();

    // const imageBase64 = base64Stamps?.main;
    // const footerImageBase64 = base64Stamps?.footer;

    await Word.run(async (context) => {
      // let body = context.document.body;

      // Get the current selection
      const selection = context.document.getSelection();

      // Insert the image at the end of the document
      const inlinePic = selection.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.end);
      await context.sync();
      inlinePic.altTextTitle = "placeholder";

      const sections = context.document.sections;
      context.load(sections, "body/style");
      await context.sync();

      // let currentPageNumber = 1;

      sections.items.forEach((section) => {
        const footer = section.getFooter("primary");
        const paragraph = footer.insertParagraph("", Word.InsertLocation.end);
        paragraph.alignment = Word.Alignment.right;

        // Insert Image
        const footerImg = paragraph.insertInlinePictureFromBase64(footerImageBase64, Word.InsertLocation.replace);
        footerImg.altTextTitle = "footer-placeholder";
        footerImg.width = 40;
        footerImg.height = 40;
        console.log(totalPages);
        //   // Insert page number using manually tracked current page number and total pages count
        //   // paragraph.insertText(`Stamp ${currentPageNumber} of ${totalPages}`, Word.InsertLocation.start);
        //   // currentPageNumber++;
      });
      await context.sync();

      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function downloadAsPDF(documentName) {
  const { setDownloadStatus } = useAuthStore.getState();
  try {
    await Word.run(async () => {
      // await replacePlaceholdersWithOriginals(); // Ensure this is complete
      // await context.sync(); // Await context.sync() for completion

      return new Promise((resolve, reject) => {
        Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 4194304 /* 4MB */ }, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            const file = result.value;
            const sliceCount = file.sliceCount;
            let slicesReceived = 0;
            const docdataSlices = [];

            const getSlice = (index) => {
              file.getSliceAsync(index, (sliceResult) => {
                if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                  docdataSlices[index] = sliceResult.value.data;
                  slicesReceived++;

                  if (slicesReceived === sliceCount) {
                    const docdata = new Uint8Array(
                      docdataSlices.flat() // Use .flat() for better handling
                    );
                    const blob = new Blob([docdata], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${documentName}.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);
                    resolve(url);
                  } else {
                    getSlice(index + 1);
                  }
                } else {
                  console.error(`Failed to get slice ${index}: ${sliceResult.error.message}`);
                  reject(`Failed to get slice ${index}: ${sliceResult.error.message}`);
                }
              });
            };

            getSlice(0);
            setDownloadStatus(true);
          } else {
            console.error(`Failed to get file: ${result.error.message}`);
            setDownloadStatus(false);
            // replaceOriginalsWithPlaceholders(); // Ensure this is appropriate
            reject(`Failed to get file: ${result.error.message}`);
          }
        });
      });
    });
  } catch (error) {
    console.error(`Error while downloading as PDF: ${error}`);
    setDownloadStatus(false);
    // replaceOriginalsWithPlaceholders(); // Ensure this is appropriate
  }
}

export async function replacePlaceholdersWithOriginals() {
  try {
    const { base64Stamps } = useAuthStore.getState();

    const originalImageBase64 = base64Stamps?.main;
    const originalFooterImageBase64 = base64Stamps?.footer;

    await Word.run(async (context) => {
      // Load all inline pictures in the document
      const body = context.document.body;
      context.load(body, "inlinePictures");
      await context.sync(); // Sync to get all inline pictures

      // Check if the body contains inline pictures
      const inlinePictures = body.inlinePictures;
      context.load(inlinePictures, "items");
      await context.sync(); // Sync to get all pictures

      if (!inlinePictures.items || inlinePictures.items.length === 0) {
        console.log("No inline pictures found.");
        return;
      }

      // Replace placeholder images in the document
      for (const picture of inlinePictures.items) {
        if (picture.altTextTitle === "placeholder") {
          // Load the original dimensions
          const originalWidth = picture.width;
          const originalHeight = picture.height;
          const insertedPicture = picture.insertInlinePictureFromBase64(
            originalImageBase64,
            Word.InsertLocation.replace
          );
          insertedPicture.width = originalWidth;
          insertedPicture.height = originalHeight;
          insertedPicture.altTextTitle = "original"; // Update altText to distinguish it
        }
      }

      // // Load all sections in the document
      const sections = context.document.sections;
      context.load(sections, "items");
      await context.sync(); // Sync to get all sections

      // Process footers in all sections
      for (const section of sections.items) {
        const footer = section.getFooter("primary");
        context.load(footer, "paragraphs");
        await context.sync(); // Sync to get all footers

        const paragraphs = footer.paragraphs;
        context.load(paragraphs, "items");
        await context.sync(); // Sync to get all paragraphs

        for (const paragraph of paragraphs.items) {
          const paragraphPictures = paragraph.inlinePictures;
          context.load(paragraphPictures, "items");
          await context.sync(); // Sync to get all inline pictures in the paragraph

          for (const picture of paragraphPictures.items) {
            if (picture.altTextTitle === "footer-placeholder") {
              const originalWidth = picture.width;
              const originalHeight = picture.height;
              const footerImg = picture.insertInlinePictureFromBase64(
                originalFooterImageBase64,
                Word.InsertLocation.replace
              );
              picture.altTextTitle = "footer-original"; // Update altText to distinguish it
              footerImg.width = originalWidth;
              footerImg.height = originalHeight;
            }
          }
        }
      }

      // Perform final sync to apply all changes
      await context.sync();
    });
  } catch (error) {
    console.error("Error replacing placeholders with original images: " + error.message);
    throw error;
  }
}

export async function replaceOriginalsWithPlaceholders() {
  try {
    const imageBase64 = await getImageBase64FromLocalPath(placeholderImagePath);
    const footerImageBase64 = await getImageBase64FromLocalPath(placeholderFooterImagePath);

    await Word.run(async (context) => {
      // Load all inline pictures in the document
      const body = context.document.body;
      context.load(body, "inlinePictures");
      await context.sync(); // Sync to get all inline pictures

      // Check if the body contains inline pictures
      const inlinePictures = body.inlinePictures;
      context.load(inlinePictures, "items");
      await context.sync(); // Sync to get all pictures

      if (!inlinePictures.items || inlinePictures.items.length === 0) {
        console.log("No inline pictures found.");
        return;
      }

      // Replace placeholder images in the document
      for (const picture of inlinePictures.items) {
        if (picture.altTextTitle === "original") {
          picture.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.replace);
          picture.altTextTitle = "placeholder"; // Update altText to distinguish it
          picture.width = 80;
          picture.height = 80;
        }
      }

      // // Load all sections in the document
      const sections = context.document.sections;
      context.load(sections, "items");
      await context.sync(); // Sync to get all sections

      // Process footers in all sections
      for (const section of sections.items) {
        const footer = section.getFooter("primary");
        context.load(footer, "paragraphs");
        await context.sync(); // Sync to get all footers

        const paragraphs = footer.paragraphs;
        context.load(paragraphs, "items");
        await context.sync(); // Sync to get all paragraphs

        for (const paragraph of paragraphs.items) {
          const paragraphPictures = paragraph.inlinePictures;
          context.load(paragraphPictures, "items");
          await context.sync(); // Sync to get all inline pictures in the paragraph

          for (const picture of paragraphPictures.items) {
            if (picture.altTextTitle === "footer-original") {
              picture.insertInlinePictureFromBase64(footerImageBase64, Word.InsertLocation.replace);
              picture.altTextTitle = "footer-placeholder"; // Update altText to distinguish it
              picture.width = 40;
              picture.height = 40;
            }
          }
        }
      }

      // Perform final sync to apply all changes
      await context.sync();
    });
  } catch (error) {
    console.error("Error replacing originals with placeholders images: " + error.message);
    throw error;
  }
}

export async function removePlaceholderImages() {
  try {
    await Word.run(async (context) => {
      // Load all inline pictures in the document
      const body = context.document.body;
      context.load(body, "inlinePictures");
      await context.sync(); // Sync to get all inline pictures

      // Check if the body contains inline pictures
      const inlinePictures = body.inlinePictures;
      context.load(inlinePictures, "items");
      console.log(inlinePictures, "items");
      await context.sync(); // Sync to get all pictures

      if (!inlinePictures.items || inlinePictures.items.length === 0) {
        console.log("No inline pictures found.");
        // return;
      } else {
        // Replace placeholder images in the document
        for (const picture of inlinePictures.items) {
          if (picture.altTextTitle === "original" || picture.altTextTitle === "placeholder") {
            picture.delete();
            // .insertInlinePictureFromBase64("", Word.InsertLocation.replace);
            // picture.altTextTitle = "placeholder";
            // picture.width = 80;
            // picture.height = 80;
          }
        }
      }

      // // Load all sections in the document
      const sections = context.document.sections;
      context.load(sections, "items");
      await context.sync(); // Sync to get all sections

      // Process footers in all sections
      for (const section of sections.items) {
        const footer = section.getFooter("primary");
        context.load(footer, "paragraphs");
        await context.sync(); // Sync to get all footers

        const paragraphs = footer.paragraphs;
        context.load(paragraphs, "items");
        await context.sync(); // Sync to get all paragraphs

        for (const paragraph of paragraphs.items) {
          const paragraphPictures = paragraph.inlinePictures;
          context.load(paragraphPictures, "items");
          await context.sync(); // Sync to get all inline pictures in the paragraph

          for (const picture of paragraphPictures.items) {
            if (picture.altTextTitle === "footer-original" || picture.altTextTitle === "footer-placeholder") {
              picture.delete();
            }
          }
          // Check if paragraph contains specific footer text and remove it
          if (paragraph.text.includes("Stamp")) {
            paragraph.delete();
          }
          // Check if paragraph contains specific footer text and remove it
          if (paragraph.text.includes("Stamp")) {
            paragraph.delete();
          }
        }
      }

      // Perform final sync to apply all changes
      await context.sync();
    });
  } catch (error) {
    console.error("Error removing placeholders images: " + error.message);
    throw error;
  }
}

export const preparePDFDownload = async () => {
  const { setDownloadStatus, setDownloadURL } = useAuthStore.getState();
  try {
    await Word.run(async (context) => {
      await replacePlaceholdersWithOriginals();
      await context.sync();

      return new Promise((resolve, reject) => {
        Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 4194304 /* 4MB */ }, async (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            const file = result.value;
            const sliceCount = file.sliceCount;
            let slicesReceived = 0;
            const docdataSlices = [];
            const getSlice = (index) => {
              file.getSliceAsync(index, async (sliceResult) => {
                if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                  docdataSlices[index] = sliceResult.value.data;
                  slicesReceived++;
                  if (slicesReceived === sliceCount) {
                    const docdata = new Uint8Array(docdataSlices.flat());
                    const blob = new Blob([docdata], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);
                    setDownloadURL(url);
                    // setDownloadBlob(blob);

                    // Close the file to free up memory
                    file.closeAsync(() => {
                      console.log("File closed successfully.");
                    });
                    resolve(url);
                  } else {
                    // await replaceOriginalsWithPlaceholders();
                    getSlice(index + 1);
                  }
                } else {
                  await replaceOriginalsWithPlaceholders();
                  console.error(`Failed to get slice ${index}: ${sliceResult.error.message}`);
                  file.closeAsync(() => {
                    console.log("File closed due to error.");
                  });
                  reject(`Failed to get slice ${index}: ${sliceResult.error.message}`);
                }
              });
            };

            getSlice(0);
            setDownloadStatus(true);
          } else {
            await replaceOriginalsWithPlaceholders();
            console.error(`Failed to get file: ${result.error.message}`);
            setDownloadStatus(false);
            reject(`Failed to get file: ${result.error.message}`);
          }
        });
      });
    });
  } catch (error) {
    console.error(`Error while downloading as PDF: ${error}`);
    setDownloadStatus(false);
    await replaceOriginalsWithPlaceholders();
    throw error;
  }
};

export const initiateDownload = async (documentName) => {
  const { downloadURL } = useAuthStore.getState();
  const a = document.createElement("a");
  a.href = downloadURL;
  a.download = `${documentName}.pdf`;
  a.click();
  URL.revokeObjectURL(downloadURL);
  await replaceOriginalsWithPlaceholders();
};
