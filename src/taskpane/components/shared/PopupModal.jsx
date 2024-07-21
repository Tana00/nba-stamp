import * as React from "react";
import PropTypes from "prop-types";
import { mergeStyleSets, FocusTrapZone, Layer, Overlay, Popup } from "@fluentui/react";

const popupStyles = mergeStyleSets({
  root: {
    background: "rgba(0, 0, 0, 0.4)",
    bottom: "0",
    left: "0",
    position: "fixed",
    right: "0",
    top: "0",
  },
  content: {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
});

export const PopupModal = (props) => {
  const { content, hidePopup } = props;

  return (
    <Layer>
      <Popup className={popupStyles.root} role="dialog" aria-modal="true" onDismiss={hidePopup}>
        <Overlay onClick={hidePopup} />
        <FocusTrapZone>
          <div role="document" className={popupStyles.content}>
            {content}
          </div>
        </FocusTrapZone>
      </Popup>
    </Layer>
  );
};

PopupModal.propTypes = {
  content: PropTypes.any,
  hidePopup: PropTypes.func,
};
