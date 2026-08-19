export type Operation = "add" | "subtract" | "multiply" | "divide";

interface OperationResponse {
  result: number;
}

interface ErrorResponse {
  error: string;
}

const API_BASE_URL = "http://localhost:8080";

export async function calculate(
  operation: Operation,
  a: number,
  b: number,
): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/${operation}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ a, b }),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error);
  }

  const data: OperationResponse = await response.json();
  return data.result;
}
