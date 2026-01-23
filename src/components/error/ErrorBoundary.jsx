import React from "react";
import { logger } from "../../utils/logger";
import ErrorPage from "./ErrorPage";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error) {
    logger.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={{message: "Something went wrong."}} />
    }

    return this.props.children; 
  }
}
