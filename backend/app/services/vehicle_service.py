from app.models.vehicle import Vehicle

def get_vehicle_by_id(db, vehicle_id: int, company_id: int):
    return db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.company_id == company_id
    ).first()