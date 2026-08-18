package repositories

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/siwakon8285/Hotel/apps/api/internal/application"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/entities"
	domainRepos "github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
)

type hotelRepoImpl struct {
	pool *pgxpool.Pool
}

func NewHotelRepository(pool *pgxpool.Pool) domainRepos.HotelRepository {
	return &hotelRepoImpl{pool: pool}
}

func (r *hotelRepoImpl) List(ctx context.Context) ([]entities.Hotel, error) {
	query := `
		SELECT id, name, slug, description, address, city, country, latitude, longitude, created_at, updated_at
		FROM hotels
		ORDER BY created_at ASC
	`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, application.ErrInternalError
	}
	defer rows.Close()

	var hotels []entities.Hotel
	for rows.Next() {
		var h entities.Hotel
		err := rows.Scan(&h.ID, &h.Name, &h.Slug, &h.Description, &h.Address, &h.City, &h.Country, &h.Latitude, &h.Longitude, &h.CreatedAt, &h.UpdatedAt)
		if err != nil {
			return nil, application.ErrInternalError
		}
		hotels = append(hotels, h)
	}

	return hotels, nil
}

func (r *hotelRepoImpl) GetByID(ctx context.Context, id uuid.UUID) (*entities.Hotel, error) {
	query := `
		SELECT id, name, slug, description, address, city, country, latitude, longitude, created_at, updated_at
		FROM hotels
		WHERE id = $1
	`
	var h entities.Hotel
	err := r.pool.QueryRow(ctx, query, id).Scan(&h.ID, &h.Name, &h.Slug, &h.Description, &h.Address, &h.City, &h.Country, &h.Latitude, &h.Longitude, &h.CreatedAt, &h.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, application.ErrNotFound
		}
		return nil, application.ErrInternalError
	}

	return &h, nil
}
