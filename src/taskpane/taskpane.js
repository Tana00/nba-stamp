/* global Word Office */

import { getImageBase64FromLocalPath } from "./helpers/imageToBase64";

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

export async function insertImageBottomRightFromLocalPath(imagePath, footerImagePath) {
  try {
    const imageBase64 = await getImageBase64FromLocalPath(imagePath);
    const footerImageBase64 = await getImageBase64FromLocalPath(footerImagePath);

    await Word.run(async (context) => {
      // let body = context.document.body;

      // Get the current selection
      const selection = context.document.getSelection();

      // Insert the image at the end of the document
      selection.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.end);
      // const image = body.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.end);
      await context.sync();

      const sections = context.document.sections;
      context.load(sections, "body/style");
      await context.sync();

      sections.items.forEach((section) => {
        const footer = section.getFooter("primary");
        const paragraph = footer.insertParagraph("", Word.InsertLocation.end);
        paragraph.alignment = Word.Alignment.right;

        const image = paragraph.insertInlinePictureFromBase64(footerImageBase64, Word.InsertLocation.replace);
      });

      await context.sync();

      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function downloadAsPDF() {
  try {
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
                const docdata = new Uint8Array(docdataSlices.reduce((acc, slice) => acc.concat(Array.from(slice)), []));
                const blob = new Blob([docdata], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "document.pdf";
                a.click();
                URL.revokeObjectURL(url);
              } else {
                getSlice(index + 1);
              }
            } else {
              console.error(`Failed to get slice ${index}: ${sliceResult.error.message}`);
            }
          });
        };

        getSlice(0);
      } else {
        console.error(`Failed to get file: ${result.error.message}`);
      }
    });
  } catch (error) {
    console.error(`Error while downloading as PDF: ${error.message}`);
  }
}
