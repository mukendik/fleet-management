from datetime import date
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.models.maintenance_alert import MaintenanceAlert


class HealthScoreEngine:

    @staticmethod
    def compute(db: Session, vehicle: Vehicle):

        alerts = db.query(MaintenanceAlert).filter(
            MaintenanceAlert.vehicle_id == vehicle.id,
            MaintenanceAlert.resolved == False
        ).all()

        score = 0

        # =====================
        # ALERT RISK
        # =====================
        score += len(alerts) * 10

        # =====================
        # MILEAGE RISK
        # =====================
        if vehicle.mileage:
            if vehicle.mileage > 200000:
                score += 40
            elif vehicle.mileage > 100000:
                score += 20

        # =====================
        # INSPECTION RISK
        # =====================
        if vehicle.technical_inspection_expiry_date:
            if vehicle.technical_inspection_expiry_date < date.today():
                score += 40

        # =====================
        # INSURANCE RISK
        # =====================
        if vehicle.insurance_expiry_date:
            if vehicle.insurance_expiry_date < date.today():
                score += 30

        score = min(score, 100)

        return {
            "score": score,
            "level": HealthScoreEngine._level(score)
        }

    @staticmethod
    def _level(score: int):

        if score < 30:
            return "healthy"
        elif score < 60:
            return "attention"
        elif score < 80:
            return "risk"
        return "critical"