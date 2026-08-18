package value_objects

type RoomStatus string

const (
	RoomStatusAvailable   RoomStatus = "available"
	RoomStatusMaintenance RoomStatus = "maintenance"
	RoomStatusDisabled    RoomStatus = "disabled"
)

func (s RoomStatus) String() string {
	return string(s)
}
