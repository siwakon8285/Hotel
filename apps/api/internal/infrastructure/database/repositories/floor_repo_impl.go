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

type floorRepoImpl struct {
	pool *pgxpool.Pool
}

func NewFloorRepository(pool *pgxpool.Pool) domainRepos.FloorRepository {
	return &floorRepoImpl{pool: pool}
}

func (r *floorRepoImpl) ListByHotelID(ctx context.Context, hotelID uuid.UUID) ([]entities.Floor, error) {
	query := `
		SELECT id, hotel_id, floor_number, name, description, created_at, updated_at
		FROM floors
		WHERE hotel_id = $1
		ORDER BY floor_number ASC
	`
	rows, err := r.pool.Query(ctx, query, hotelID)
	if err != nil {
		return nil, application.ErrInternalError
	}
	defer rows.Close()

	var floors []entities.Floor
	for rows.Next() {
		var f entities.Floor
		err := rows.Scan(&f.ID, &f.HotelID, &f.FloorNumber, &f.Name, &f.Description, &f.CreatedAt, &f.UpdatedAt)
		if err != nil {
			return nil, application.ErrInternalError
		}
		floors = append(floors, f)
	}

	return floors, nil
}

func (r *floorRepoImpl) GetByID(ctx context.Context, id uuid.UUID) (*entities.Floor, error) {
	query := `
		SELECT id, hotel_id, floor_number, name, description, created_at, updated_at
		FROM floors
		WHERE id = $1
	`
	var f entities.Floor
	err := r.pool.QueryRow(ctx, query, id).Scan(&f.ID, &f.HotelID, &f.FloorNumber, &f.Name, &f.Description, &f.CreatedAt, &f.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, application.ErrNotFound
		}
		return nil, application.ErrInternalError
	}

	return &f, nil
}
