from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle


def get_vehicle_by_id(
    db: Session,
    vehicle_id: int,
    company_id: int
) -> Vehicle | None:
    """
    Retrieve a vehicle belonging to a specific company.
    """

    return (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id,
            Vehicle.company_id == company_id
        )
        .first()
    )


def get_vehicle_by_plate(
    db: Session,
    plate_number: str,
    company_id: int
) -> Vehicle | None:
    """
    Retrieve a vehicle by plate number.
    """

    return (
        db.query(Vehicle)
        .filter(
            Vehicle.plate_number == plate_number,
            Vehicle.company_id == company_id
        )
        .first()
    )


def vehicle_exists(
    db: Session,
    plate_number: str,
    company_id: int
) -> bool:
    """
    Check if a plate number already exists
    for the current company.
    """

    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.plate_number == plate_number,
            Vehicle.company_id == company_id
        )
        .first()
    )

    return vehicle is not None