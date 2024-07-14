/* global Word */
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

export async function insertImageBottomRightFromLocalPath(imagePath) {
  try {
    const imageBase64 = await getImageBase64FromLocalPath(imagePath);

    await Word.run(async (context) => {
      let body = context.document.body;

      // Insert the image at the end of the document
      const image = body.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.end);
      // body.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.end);
      await context.sync();

      // Position the image at the bottom right
      image.float = {
        horizontalAlignment: Word.HorizontalAlignment.right,
        verticalAlignment: Word.VerticalAlignment.bottom,
      };

      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}
