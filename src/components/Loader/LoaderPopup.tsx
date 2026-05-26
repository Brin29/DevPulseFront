import ReactDOM from "react-dom";
import { Hourglass } from "ldrs/react";
import "./Loader.scss"
import "ldrs/react/Hourglass.css";

export const LoaderPopup = () => {
  return ReactDOM.createPortal (
    <div className="loader-overlay">
      <div className="loader-spinner">
        <div className="loader">
          <Hourglass size="70" bgOpacity="0.1" speed="1.75" color="black" />
        </div>
      </div>
    </div>,
    document.body
  );
};
