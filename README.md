# Calculator

A full-stack calculator: a Go HTTP API doing the arithmetic, and a React (TypeScript) frontend
calling it. Built as a take-home assignment.

## Stack

- **Backend**: Go, standard library only (`net/http`), no framework
- **Frontend**: React 19 + TypeScript, built with Vite
- **Testing**: Go's built-in `testing` package on the backend; Vitest + React Testing Library on
  the frontend

## Requirements checklist

| Requirement | Status |
|---|---|
| Add, subtract, multiply, divide | Done, both backend and frontend |
| Input validation and error handling | Done (invalid JSON, division by zero, both return a `400` with a clear error message, surfaced on screen in the UI) |
| Unit tests, both layers, with coverage report | Done, 10 backend tests, 12 frontend tests, coverage reported for each (see [Testing](#testing)) |
| README: setup, API examples, design rationale | This file |
| Extra operation: percentage | Done (frontend-only, see [Percent](#percent)) |
| Extra operations: exponent, square root | Not implemented, scoped out to prioritize depth on the required four plus real test coverage |
| AI tooling disclosed, prompts shared | Done (see [AI tooling](#ai-tooling)) |
| Dockerfile (frontend + backend together) | Not included, listed as optional in the assignment |

## Project structure

```
backend/
  go.mod              module definition (github.com/rachelmgaldino/calculator-go-react/backend)
  calculator.go       pure arithmetic (Add, Subtract, Multiply, Divide)
  calculator_test.go  table-driven tests for the above
  main.go             HTTP handlers, routing, CORS
  main_test.go        handler tests (httptest)
frontend/
  package.json        dependencies and npm scripts (dev, build, test)
  src/
    api.ts             typed client for calling the backend
    api.test.ts        tests for api.ts (mocked fetch)
    App.tsx            UI and calculator state
    App.test.tsx       tests for App.tsx (mocked api.ts)
```

## Running it

### Backend

Requires Go (built and tested with Go 1.26).

```bash
cd backend
go run .
```

Starts the API on `http://localhost:8080`.

Run the backend tests:

```bash
cd backend
go test ./...
```

With a coverage summary:

```bash
go test -cover ./...
```

### Frontend

Requires Node (built and tested with Node 24).

```bash
cd frontend
npm install
npm run dev
```

Opens the app on `http://localhost:5173`. The backend must be running separately for calculations
to work, the frontend calls `http://localhost:8080` directly.

Run the frontend tests:

```bash
cd frontend
npm test
```

With a coverage report:

```bash
npm run test:coverage
```

## API

Four endpoints, all `POST`, all expecting and returning JSON.

**Request body**, same shape for every endpoint:

```json
{ "a": 12, "b": 5 }
```

**Success response**, `200 OK`:

```json
{ "result": 17 }
```

**Error response** (invalid JSON, or division by zero), `400 Bad Request`:

```json
{ "error": "cannot divide by zero" }
```

### Endpoints

| Method | Path        | Operation      |
|--------|-------------|----------------|
| POST   | `/add`      | `a + b`        |
| POST   | `/subtract` | `a - b`        |
| POST   | `/multiply` | `a * b`        |
| POST   | `/divide`   | `a / b`        |

### Example

```bash
curl -X POST http://localhost:8080/add \
  -H "Content-Type: application/json" \
  -d '{"a": 12, "b": 5}'
```

```json
{"result":17}
```

Dividing by zero:

```bash
curl -X POST http://localhost:8080/divide \
  -H "Content-Type: application/json" \
  -d '{"a": 5, "b": 0}'
```

```json
{"error":"cannot divide by zero"}
```

CORS is enabled (`Access-Control-Allow-Origin: *`) so the API can be called directly from a browser
running on a different origin, which is what the frontend dev server does.

### Percent

`%` (percentage) is implemented, but entirely on the frontend: pressing it divides the current
number by 100. It's pure arithmetic with no failure case, so it doesn't call the backend at all,
there was nothing a network round-trip would add.

## Testing

Backend: 10 tests across pure arithmetic and HTTP handlers, using table-driven tests and Go's
`net/http/httptest` package to test handlers without a real running server.

Frontend: 12 tests across the API client and the full calculator UI (digit entry, chained
operations, division-by-zero error display), using React Testing Library's approach of rendering
the real component and interacting with it the way a user would, rather than testing internals
directly. Calls to the backend are mocked in these tests, so they run without a live Go server.

Coverage is intentionally not 100% on either layer. The uncovered lines are mechanical repeats of
already-tested logic (e.g. the `subtract`/`multiply` handlers follow the identical pattern as the
tested `add` handler, just calling a different function), not untested behavior.

## Design decisions

**Dark mode only, no keyboard shortcuts.** The assignment didn't ask for either, and adding them
would have meant guessing at requirements instead of building what was actually specified.

**The UI design** was built with an AI design tool (not hand-coded from scratch, and not sourced
from any existing calculator's real code), then implemented here as original React/TypeScript from
that visual reference. Only the visual design was used, no code was copied from the design tool's
own output.

**Backend validation lives in the HTTP layer, not the arithmetic layer.** `calculator.go`'s
functions only handle genuine arithmetic failure (division by zero). Whether a request is valid
JSON at all is a concern about parsing a request, not about math, so it's handled in `main.go`
instead. Keeps the pure calculation functions simple and independently testable.

**One `calculate()` function on the frontend, not four.** All four operations hit the backend the
same way, method, headers, body shape, only the URL path differs. Four separate functions would
have been identical except for one string.

## AI tooling

This project was built with Claude Code, used throughout as a pairing tool: primarily to learn Go,
a language never used before, from the ground up while building something real with it, and to
explain concepts before writing any code. I typed and committed all of the code myself; Claude
explained each concept and piece before I wrote it, and ran verification (builds, test suites,
manual curl checks against the running backend) rather than writing code directly into the project.

Representative prompts used over the course of the project:

- "Let's build the backend in Go. I've never used it before, but I think showing I can pick up a
  different stack is worth more here than staying inside what I already know."
- "I've never used Go, so walk me through concepts as they come up, I'll need to be able to explain
  this project myself afterward."
- "I found a bug: pressing backspace with two digits typed shows the literal word 'next' on screen
  instead of deleting a character. Can you explain why so I can fix it?"
- "Is 'fresh' really the best name for this state variable?"
- "Explain the concept and why we're using this approach before showing me any code, I want to
  actually understand it, not just have something that works."
- "Review the code for anything that needs fixing, then I'll write, test, and commit it myself."

A running study-notes file (kept local, not part of this repo) was maintained throughout to record
what was learned and why decisions were made, for my own later reference.
