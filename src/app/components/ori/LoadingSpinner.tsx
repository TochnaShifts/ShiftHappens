import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export const LoadingSpinner = () => (
  <ClipLoader size={150} aria-label="Loading Spinner" data-testid="loader" />
);

export default LoadingSpinner;
