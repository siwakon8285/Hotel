package dtos

import (
	"testing"
)

func TestFormatPrice(t *testing.T) {
	tests := []struct {
		name     string
		thb      int64
		expected string
	}{
		{"4500", 4500, "4500.00"},
		{"5200", 5200, "5200.00"},
		{"7900", 7900, "7900.00"},
		{"10500", 10500, "10500.00"},
		{"25000", 25000, "25000.00"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := FormatPrice(tt.thb)
			if result != tt.expected {
				t.Errorf("FormatPrice(%d) = %s; expected %s", tt.thb, result, tt.expected)
			}
		})
	}
}
