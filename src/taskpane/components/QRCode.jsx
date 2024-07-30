import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import QRCode from "qrcode";

const QRCodeOverlay = ({ qrCodeValue, qrCodeSize = 50 }) => {
  const [qrCodeSvg, setQrCodeSvg] = useState(null);

  useEffect(() => {
    // Generate QR code
    const generateQRCode = async () => {
      try {
        const qrCodeSVG = await QRCode.toString(qrCodeValue, {
          type: "svg",
          width: qrCodeSize,
        });
        setQrCodeSvg(qrCodeSVG);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    };

    generateQRCode();
  }, [qrCodeValue, qrCodeSize]);

  return qrCodeSvg;

  // return (
  //   <div style={{ position: "relative", display: "inline-block" }}>
  //     {/* Existing SVG */}
  //     <Stamp firstName={firstName} lastName={lastName} number={number} />

  //     {/* QR Code Overlay */}
  //     <div
  //       dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
  //       style={{
  //         position: "absolute",
  //         top: "50%",
  //         left: "50%",
  //         transform: "translate(-50%, -50%)",
  //         width: qrCodeSize,
  //         height: qrCodeSize,
  //       }}
  //     />
  //   </div>
  // );
};

QRCodeOverlay.propTypes = {
  qrCodeValue: PropTypes.string,
  qrCodeSize: PropTypes.number,
};

export default QRCodeOverlay;
