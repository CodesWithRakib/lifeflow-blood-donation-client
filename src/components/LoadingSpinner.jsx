import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: currentColor;
`;

/**
 * LoadingSpinner component - A customizable loading spinner with smooth animations
 * @param {Object} props - Component props
 * @param {string} [props.color="#36D7B7"] - Color of the spinner
 * @param {number} [props.size=35] - Size of the spinner in pixels
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {string} [props.loadingText=""] - Optional loading text to display
 * @param {boolean} [props.fullScreen=false] - Whether to cover full screen
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({
  color = "#36D7B7",
  size = 35,
  className = "",
  loadingText = "",
  fullScreen = false,
}) => {
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <ClipLoader
        color={color}
        css={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {loadingText && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {loadingText}
        </p>
      )}
    </div>
  );

  return fullScreen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
      {spinner}
    </div>
  ) : (
    spinner
  );
};

LoadingSpinner.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  loadingText: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default LoadingSpinner;
