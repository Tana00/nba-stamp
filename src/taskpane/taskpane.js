/* global Word Office */
import { useAuthStore } from "./store";

import { getImageBase64FromLocalPath } from "./helpers/imageToBase64";

const placeholderImagePath = "../../assets/gray-stamp.png";
const placeholderFooterImagePath = "../../assets/for-gray-stamp.png";
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

export async function insertImageBottomRightFromLocalPath() {
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

      sections.items.forEach((section) => {
        const footer = section.getFooter("primary");
        const paragraph = footer.insertParagraph("", Word.InsertLocation.end);
        paragraph.alignment = Word.Alignment.right;

        // Insert Image
        const footerImg = paragraph.insertInlinePictureFromBase64(footerImageBase64, Word.InsertLocation.replace);
        footerImg.altTextTitle = "footer-placeholder";
        footerImg.width = 40;
        footerImg.height = 40;
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
    await Word.run(async (context) => {
      await replacePlaceholdersWithOriginals();
      context.sync();

      return new Promise((resolve, reject) => {
        Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 4194304 /* 4MB */ }, (result) => {
          if (result.status == Office.AsyncResultStatus.Succeeded) {
            const file = result.value;
            const sliceCount = file.sliceCount;
            let slicesReceived = 0;
            let docdataSlices = [];

            const getSlice = (index) => {
              file.getSliceAsync(index, (sliceResult) => {
                if (sliceResult.status == Office.AsyncResultStatus.Succeeded) {
                  docdataSlices[index] = sliceResult.value.data;
                  slicesReceived++;

                  if (slicesReceived === sliceCount) {
                    const docdata = new Uint8Array(
                      docdataSlices.reduce((acc, slice) => acc.concat(Array.from(slice)), [])
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
            replaceOriginalsWithPlaceholders();
          } else {
            reject(`Failed to get file: ${result.error.message}`);
            console.error(`Failed to get file: ${result.error.message}`);
            setDownloadStatus(false);
            replaceOriginalsWithPlaceholders();
          }
        });
      });
    });
  } catch (error) {
    console.error(`Error while downloading as PDF: ${error}`);
    setDownloadStatus(false);
  }
}

export async function replacePlaceholdersWithOriginals() {
  try {
    const { base64Stamps } = useAuthStore.getState();

    // const originalImageBase64 = await getImageBase64FromLocalPath(originalImagePath);
    // const originalFooterImageBase64 = await getImageBase64FromLocalPath(originalFooterImagePath);
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
          // Example condition
          picture.insertInlinePictureFromBase64(originalImageBase64, Word.InsertLocation.replace);
          picture.altTextTitle = "original"; // Update altText to distinguish it
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
            if (picture.altTextTitle === "footer-placeholder") {
              // Example condition
              picture.insertInlinePictureFromBase64(originalFooterImageBase64, Word.InsertLocation.replace);
              picture.altTextTitle = "footer-original"; // Update altText to distinguish it
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
              // Example condition
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
