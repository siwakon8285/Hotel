package repositories

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/siwakon8285/Hotel/apps/api/internal/application"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/entities"
	domainRepos "github.com/siwakon8285/Hotel/apps/api/internal/domain/repositories"
	"github.com/siwakon8285/Hotel/apps/api/internal/domain/value_objects"
)

type roomRepoImpl struct {
	pool *pgxpool.Pool
}

func NewRoomRepository(pool *pgxpool.Pool) domainRepos.RoomRepository {
	return &roomRepoImpl{pool: pool}
}

func (r *roomRepoImpl) ListByFloorID(ctx context.Context, floorID uuid.UUID) ([]entities.Room, error) {
	query := `
		SELECT 
			r.id, r.floor_id, r.room_number, r.status, r.model_key,
			rt.id, rt.name, rt.base_price, rt.max_guests, rt.bed_type, rt.room_size
		FROM rooms r
		JOIN room_types rt ON r.room_type_id = rt.id
		WHERE r.floor_id = $1
		ORDER BY r.room_number ASC
	`
	rows, err := r.pool.Query(ctx, query, floorID)
	if err != nil {
		return nil, application.ErrInternalError
	}
	defer rows.Close()

	var rooms []entities.Room
	var roomIDs []uuid.UUID

	for rows.Next() {
		var room entities.Room
		var statusStr string
		var rt entities.RoomType

		err := rows.Scan(
			&room.ID, &room.FloorID, &room.RoomNumber, &statusStr, &room.ModelKey,
			&rt.ID, &rt.Name, &rt.BasePrice, &rt.MaxGuests, &rt.BedType, &rt.RoomSize,
		)
		if err != nil {
			return nil, application.ErrInternalError
		}

		room.Status = value_objects.RoomStatus(statusStr)
		room.RoomType = &rt
		rooms = append(rooms, room)
		roomIDs = append(roomIDs, room.ID)
	}

	// Fetch amenities
	if len(roomIDs) > 0 {
		amenitiesMap, err := r.getAmenitiesForRooms(ctx, roomIDs)
		if err != nil {
			return nil, err
		}
		for i := range rooms {
			rooms[i].Amenities = amenitiesMap[rooms[i].ID]
		}
	}

	return rooms, nil
}

func (r *roomRepoImpl) GetByID(ctx context.Context, id uuid.UUID) (*entities.Room, error) {
	query := `
		SELECT 
			r.id, r.floor_id, r.room_number, r.status, r.model_key,
			f.id, f.floor_number, f.name, f.description,
			rt.id, rt.name, rt.description, rt.base_price, rt.max_guests, rt.bed_type, rt.room_size
		FROM rooms r
		JOIN floors f ON r.floor_id = f.id
		JOIN room_types rt ON r.room_type_id = rt.id
		WHERE r.id = $1
	`
	var room entities.Room
	var statusStr string
	var f entities.Floor
	var rt entities.RoomType

	err := r.pool.QueryRow(ctx, query, id).Scan(
		&room.ID, &room.FloorID, &room.RoomNumber, &statusStr, &room.ModelKey,
		&f.ID, &f.FloorNumber, &f.Name, &f.Description,
		&rt.ID, &rt.Name, &rt.Description, &rt.BasePrice, &rt.MaxGuests, &rt.BedType, &rt.RoomSize,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, application.ErrNotFound
		}
		return nil, application.ErrInternalError
	}
	room.Status = value_objects.RoomStatus(statusStr)
	room.Floor = &f
	room.RoomType = &rt

	// Fetch amenities
	amenitiesMap, err := r.getAmenitiesForRooms(ctx, []uuid.UUID{room.ID})
	if err != nil {
		return nil, err
	}
	room.Amenities = amenitiesMap[room.ID]

	return &room, nil
}

func (r *roomRepoImpl) Search(ctx context.Context, filter domainRepos.RoomSearchFilter) ([]entities.Room, error) {
	// Base query
	query := `
		SELECT 
			r.id, r.floor_id, r.room_number, r.status, r.model_key,
			rt.id, rt.name, rt.base_price, rt.max_guests, rt.bed_type, rt.room_size
		FROM rooms r
		JOIN room_types rt ON r.room_type_id = rt.id
	`

	whereClauses := []string{"r.status = 'available'"} // Maintenance and disabled are not bookable
	args := []interface{}{}
	argCounter := 1

	// Filter by Date (Availability Check)
	if filter.CheckIn != nil && filter.CheckOut != nil {
		// Use LEFT JOIN to find overlapping active bookings. If b.id is NULL, no overlap exists.
		joinClause := fmt.Sprintf(`
			LEFT JOIN bookings b ON b.room_id = r.id 
			AND b.status IN ('pending', 'confirmed') 
			AND daterange(b.check_in, b.check_out, '[)') && daterange($%d::date, $%d::date, '[)')
		`, argCounter, argCounter+1)

		query += joinClause
		whereClauses = append(whereClauses, "b.id IS NULL")

		args = append(args, *filter.CheckIn, *filter.CheckOut)
		argCounter += 2
	}

	if filter.Guests != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("rt.max_guests >= $%d", argCounter))
		args = append(args, *filter.Guests)
		argCounter++
	}

	if filter.RoomType != nil {
		whereClauses = append(whereClauses, fmt.Sprintf("rt.id = $%d", argCounter))
		args = append(args, *filter.RoomType)
		argCounter++
	}

	query += " WHERE " + strings.Join(whereClauses, " AND ")
	query += " ORDER BY r.room_number ASC"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, application.ErrInternalError
	}
	defer rows.Close()

	var rooms []entities.Room
	var roomIDs []uuid.UUID

	for rows.Next() {
		var room entities.Room
		var statusStr string
		var rt entities.RoomType

		err := rows.Scan(
			&room.ID, &room.FloorID, &room.RoomNumber, &statusStr, &room.ModelKey,
			&rt.ID, &rt.Name, &rt.BasePrice, &rt.MaxGuests, &rt.BedType, &rt.RoomSize,
		)
		if err != nil {
			return nil, application.ErrInternalError
		}

		room.Status = value_objects.RoomStatus(statusStr)
		room.RoomType = &rt
		rooms = append(rooms, room)
		roomIDs = append(roomIDs, room.ID)
	}

	// Fetch amenities
	if len(roomIDs) > 0 {
		amenitiesMap, err := r.getAmenitiesForRooms(ctx, roomIDs)
		if err != nil {
			return nil, err
		}
		for i := range rooms {
			rooms[i].Amenities = amenitiesMap[rooms[i].ID]
		}
	}

	return rooms, nil
}

func (r *roomRepoImpl) getAmenitiesForRooms(ctx context.Context, roomIDs []uuid.UUID) (map[uuid.UUID][]entities.Amenity, error) {
	query := `
		SELECT ra.room_id, a.id, a.name, a.icon
		FROM room_amenities ra
		JOIN amenities a ON a.id = ra.amenity_id
		WHERE ra.room_id = ANY($1)
	`
	rows, err := r.pool.Query(ctx, query, roomIDs)
	if err != nil {
		return nil, application.ErrInternalError
	}
	defer rows.Close()

	amenitiesMap := make(map[uuid.UUID][]entities.Amenity)
	for rows.Next() {
		var roomID uuid.UUID
		var a entities.Amenity
		err := rows.Scan(&roomID, &a.ID, &a.Name, &a.Icon)
		if err != nil {
			return nil, application.ErrInternalError
		}
		amenitiesMap[roomID] = append(amenitiesMap[roomID], a)
	}
	return amenitiesMap, nil
}
