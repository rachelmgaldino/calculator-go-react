package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAddHandler(t *testing.T) {
	body := strings.NewReader(`{"a": 5, "b": 3}`)
	req := httptest.NewRequest(http.MethodPost, "/add", body)
	w := httptest.NewRecorder()

	addHandler(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status %v, got %v", http.StatusOK, w.Code)
	}

	var resp OperationResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp.Result != 8 {
		t.Errorf("expected result 8, got %v", resp.Result)
	}
}

func TestSubtractHandler(t *testing.T) {
	body := strings.NewReader(`{"a": 10, "b": 4}`)
	req := httptest.NewRequest(http.MethodPost, "/subtract", body)
	w := httptest.NewRecorder()

	subtractHandler(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status %v, got %v", http.StatusOK, w.Code)
	}

	var resp OperationResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp.Result != 6 {
		t.Errorf("expected result 6, got %v", resp.Result)
	}
}

func TestMultiplyHandler(t *testing.T) {
	body := strings.NewReader(`{"a": 6, "b": 7}`)
	req := httptest.NewRequest(http.MethodPost, "/multiply", body)
	w := httptest.NewRecorder()

	multiplyHandler(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status %v, got %v", http.StatusOK, w.Code)
	}

	var resp OperationResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp.Result != 42 {
		t.Errorf("expected result 42, got %v", resp.Result)
	}
}

func TestDivideHandler(t *testing.T) {
	body := strings.NewReader(`{"a": 20, "b": 4}`)
	req := httptest.NewRequest(http.MethodPost, "/divide", body)
	w := httptest.NewRecorder()

	divideHandler(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status %v, got %v", http.StatusOK, w.Code)
	}

	var resp OperationResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp.Result != 5 {
		t.Errorf("expected result 5, got %v", resp.Result)
	}
}

func TestDivideHandlerByZero(t *testing.T) {
	body := strings.NewReader(`{"a": 5, "b": 0}`)
	req := httptest.NewRequest(http.MethodPost, "/divide", body)
	w := httptest.NewRecorder()

	divideHandler(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status %v, got %v", http.StatusBadRequest, w.Code)
	}

	var resp ErrorResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp.Error != "cannot divide by zero" {
		t.Errorf("expected error message 'cannot divide by zero', got %v", resp.Error)
	}
}

func TestAddHandlerInvalidJSON(t *testing.T) {
	body := strings.NewReader(`not json`)
	req := httptest.NewRequest(http.MethodPost, "/add", body)
	w := httptest.NewRecorder()

	addHandler(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status %v, got %v", http.StatusBadRequest, w.Code)
	}

	var resp ErrorResponse
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp.Error != "invalid request body" {
		t.Errorf("expected error message 'invalid request body', got %v", resp.Error)
	}
}