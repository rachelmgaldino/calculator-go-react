package main

import "testing"

func TestAdd(t *testing.T) {
	result := Add(2,3)
	expected:= 5.0

	if result != expected {
		t.Errorf("Add(2,3) = %v, expected %v", result, expected)
	}
}