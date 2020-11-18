import React from "react";
import App from "./App.js";
import { render } from "@testing-library/react";

it("should render title", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId("page-title")).toBeDefined();
});
