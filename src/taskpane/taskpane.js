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
      // let body = context.document.body;

      // Get the current selection
      const selection = context.document.getSelection();

      // Insert the image at the end of the document
      const image = selection.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.end);
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

export const saveDocumentAsPdf = async () => {
  try {
    await Word.run(async (context) => {
      console.log(Word, context);
      const pdfFile = await context.document.saveAs("sample.pdf", Word.SaveBehavior.save);

      console.log("Document saved as PDF:", pdfFile.value, Word.SaveAsFileType);
    });
  } catch (error) {
    console.log("Error saving as PDF: " + error);
  }
};

// export const insertStampImage = async (imagePath) => {
//   try {
//     const imageBase64 = await getImageBase64FromLocalPath(imagePath);
//     await Word.run(async (context) => {
//       const sections = context.document.sections;
//       sections.load("items");
//       await context.sync();

//       console.log("sections", sections.items);

//       sections.items.forEach(async (section) => {
//         const footer = section.getFooter(Word.HeaderFooterType.primary);
//         const paragraphs = footer.body.paragraphs;
//         paragraphs.load("items");

//         await context.sync();

//         return context.sync().then(async () => {
//           const paragraph = paragraphs.items[0];
//           paragraph.insertInlinePictureFromBase64(imageBase64, Word.InsertLocation.end);
//           paragraph.alignment = Word.Alignment.right;
//           paragraph.font.set({ bold: true, size: 10 });

//           await context.sync();
//         });
//       });
//     });
//   } catch (error) {
//     console.log("Error: " + error);
//   }
// };
