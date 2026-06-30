from app.models.vehicle_assignment import VehicleAssignment

def get_active_assignments(db, company_id):
    return (
        db.query(VehicleAssignment)
        .filter(
            VehicleAssignment.company_id == company_id,
            VehicleAssignment.is_active == True
        )
        .all()
    )