package main

import "testing"

func TestAdd(t *testing.T) {
	tests := []struct {
		a, b     float64
		expected float64
	}{
		{2, 3, 5},
		{-1, 1, 0},
		{0, 0, 0},
	}

	for _, tt := range tests {
		result := Add(tt.a, tt.b)
		if result != tt.expected {
			t.Errorf("Add(%v, %v) = %v, expected %v", tt.a, tt.b, result, tt.expected)
		}
	}
}

func TestSubtract(t *testing.T) {
	tests := []struct {
		a, b     float64
		expected float64
	}{
		{5, 3, 2},
		{0, 5, -5},
		{-2, -2, 0},
	}

	for _, tt := range tests {
		result := Subtract(tt.a, tt.b)
		if result != tt.expected {
			t.Errorf("Subtract(%v, %v) = %v, expected %v", tt.a, tt.b, result, tt.expected)
		}
	}
}

func TestMultiply(t *testing.T) {
	tests := []struct {
		a, b     float64
		expected float64
	}{
		{4, 3, 12},
		{-2, 3, -6},
		{0, 100, 0},
	}

	for _, tt := range tests {
		result := Multiply(tt.a, tt.b)
		if result != tt.expected {
			t.Errorf("Multiply(%v, %v) = %v, expected %v", tt.a, tt.b, result, tt.expected)
		}
	}
}

func TestDivide(t *testing.T) {
	tests := []struct {
		a, b        float64
		expected    float64
		expectError bool
	}{
		{10, 2, 5, false},
		{7, 2, 3.5, false},
		{5, 0, 0, true},
	}

	for _, tt := range tests {
		result, err := Divide(tt.a, tt.b)

		if tt.expectError {
			if err == nil {
				t.Errorf("Divide(%v, %v) expected an error, got none", tt.a, tt.b)
			}
			continue
		}

		if err != nil {
			t.Errorf("Divide(%v, %v) returned unexpected error: %v", tt.a, tt.b, err)
		}
		if result != tt.expected {
			t.Errorf("Divide(%v, %v) = %v, expected %v", tt.a, tt.b, result, tt.expected)
		}
	}
}