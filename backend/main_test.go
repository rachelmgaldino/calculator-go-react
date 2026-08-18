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