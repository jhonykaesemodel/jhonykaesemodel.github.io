import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
describe("experience", () => {
  it("starts the guided sequence", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Separate the pair/i));
    expect(screen.getByText("One event becomes two.")).toBeInTheDocument();
  });
  it("runs the Bell laboratory", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Open Bell laboratory/i));
    fireEvent.click(screen.getByText("Run 100"));
    expect(screen.getByText(/100 trials/)).toBeInTheDocument();
  });
});
