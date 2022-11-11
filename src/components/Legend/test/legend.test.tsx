import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import Legend from "../";

test("redering Legend", () => {
  const items = [
    {
      color: "#FED976",
      text: "1-25",
    },
    {
      color: "#FEB24C",
      text: "25-50",
    },
    {
      color: "#FD8D3C",
      text: "50-250",
    },
    {
      color: "#FC4E2A",
      text: "250-500",
    },
    {
      color: "#E31A1C",
      text: "500-2500",
    },
    {
      color: "#BD0026",
      text: "2500-25000",
    },
    {
      color: "#800026",
      text: "25000-50000",
    },
    {
      color: "#2f000e",
      text: "50000+",
    },
  ];

  const component = render(<Legend items={items} />);

  component.getByText("1-25");
  component.getByText("25-50");
  component.getByText("50-250");
  component.getByText("250-500");
  component.getByText("500-2500");
  component.getByText("2500-25000");
  component.getByText("25000-50000");
  component.getByText("50000+");
});
