import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import { vi } from "vitest";
import { calculate } from "./api";

import App from "./App";

describe("digit entry, backspace, and clear", () => {
  test("starts showing 0", () => {
    render(<App />);
    expect(screen.getByTestId("result")).toHaveTextContent("0");
  });

  test("typing digits builds up the display", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "1" }));
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  test("backspace removes the last digit", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "1" }));
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    await userEvent.click(screen.getByRole("button", { name: "Backspace" }));
    expect(screen.getByTestId("result")).toHaveTextContent("1");
  });

  test("AC resets back to 0", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "AC" }));
    expect(screen.getByTestId("result")).toHaveTextContent("0");
  });
});

vi.mock("./api");

describe("operators and equals, calling the backend", () => {
  test("12 + 5 = calls the backend and shows the result", async () => {
    vi.mocked(calculate).mockResolvedValueOnce(17);
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "1" }));
    await userEvent.click(screen.getByRole("button", { name: "2" }));
    await userEvent.click(screen.getByRole("button", { name: "+" }));
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "=" }));

    expect(calculate).toHaveBeenCalledWith("add", 12, 5);
    expect(screen.getByTestId("result")).toHaveTextContent("17");
  });

  test("division by zero shows Error", async () => {
    vi.mocked(calculate).mockRejectedValueOnce(
      new Error("cannot divide by zero"),
    );
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "÷" }));
    await userEvent.click(screen.getByRole("button", { name: "0" }));
    await userEvent.click(screen.getByRole("button", { name: "=" }));

    const result = screen.getByTestId("result");
    expect(result).toHaveTextContent("Error");
    expect(result).toHaveClass("error");
  });

  test("decimal entry, and a second dot is ignored", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    await userEvent.click(screen.getByRole("button", { name: "." }));
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "." }));
    await userEvent.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByTestId("result")).toHaveTextContent("3.51");
  });

  test("percent divides the current number by 100", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "0" }));
    await userEvent.click(screen.getByRole("button", { name: "%" }));
    expect(screen.getByTestId("result")).toHaveTextContent("0.5");
  });

  test("chaining resolves the pending calculation before starting the next one", async () => {
    vi.mocked(calculate).mockResolvedValueOnce(5);
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "2" }));
    await userEvent.click(screen.getByRole("button", { name: "+" }));
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    await userEvent.click(screen.getByRole("button", { name: "+" }));

    expect(calculate).toHaveBeenCalledWith("add", 2, 3);
    expect(screen.getByTestId("result")).toHaveTextContent("5");
  });

  test("a backend failure mid-chain shows Error", async () => {
    vi.mocked(calculate).mockRejectedValueOnce(
      new Error("cannot divide by zero"),
    );
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "5" }));
    await userEvent.click(screen.getByRole("button", { name: "÷" }));
    await userEvent.click(screen.getByRole("button", { name: "0" }));
    await userEvent.click(screen.getByRole("button", { name: "+" }));

    const result = screen.getByTestId("result");
    expect(result).toHaveTextContent("Error");
    expect(result).toHaveClass("error");
  });
});
