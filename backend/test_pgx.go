package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

func main() {
	conn, err := pgx.Connect(context.Background(), "postgres://hotel_app:hotel_dev_password@localhost:5434/hotel_booking?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close(context.Background())

	var val int64
	// query a whole numeric
	err = conn.QueryRow(context.Background(), "SELECT 4500.00::NUMERIC").Scan(&val)
	if err != nil {
		fmt.Printf("Error scanning 4500.00 into int64: %v\n", err)
	} else {
		fmt.Printf("Scanned 4500.00 into int64 successfully: %d\n", val)
	}
}
