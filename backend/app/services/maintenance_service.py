from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.models.maintenance_rule import MaintenanceRule
from app.models.maintenance_alert import MaintenanceAlert


# =========================
# MAIN ENGINE
# =========================

class MaintenanceService:

    # -------------------------
    # CHECK SINGLE VEHICLE
    # -------------------------
    @staticmethod
    def check_vehicle(db: Session, vehicle: Vehicle):

        rules = db.query(MaintenanceRule).filter(
            MaintenanceRule.company_id == vehicle.company_id
        ).all()

        alerts_created = []

        for rule in rules:

            # =====================
            # KM BASED RULES
            # =====================
            if rule.interval_km is None:
                
                next_due = (vehicle.mileage or 0) + rule.interval_km
                warning_threshold = next_due - (rule.warning_before_km or 0)

                if vehicle.mileage >= warning_threshold:

                    existing = db.query(MaintenanceAlert).filter(
                        MaintenanceAlert.vehicle_id == vehicle.id,
                        MaintenanceAlert.rule_name == rule.name,
                        MaintenanceAlert.resolved == False
                    ).first()

                    if not existing:

                        alert = MaintenanceAlert(
                            vehicle_id=vehicle.id,
                            company_id=vehicle.company_id,
                            rule_name=rule.name,
                            due_km=next_due,
                            current_km=vehicle.mileage,
                            severity="critical" if vehicle.mileage >= next_due else "warning",
                            resolved=False
                        )

                        db.add(alert)
                        alerts_created.append(alert)

            # =====================
            # INSPECTION DATE
            # =====================
            if rule.name.lower() == "inspection":
                if vehicle.technical_inspection_expiry_date:
                    if vehicle.technical_inspection_expiry_date <= date.today() + timedelta(days=30):

                        MaintenanceService._create_alert_if_not_exists(
                            db, vehicle, rule.name, "inspection expiring soon"
                        )

            # =====================
            # INSURANCE DATE
            # =====================
            if rule.name.lower() == "insurance":
                if vehicle.insurance_expiry_date:
                    if vehicle.insurance_expiry_date <= date.today() + timedelta(days=30):

                        MaintenanceService._create_alert_if_not_exists(
                            db, vehicle, rule.name, "insurance expiring soon"
                        )

        db.commit()
        return alerts_created

    # -------------------------
    # SAFE ALERT CREATION
    # -------------------------
    @staticmethod
    def _create_alert_if_not_exists(db, vehicle, rule_name, reason):

        existing = db.query(MaintenanceAlert).filter(
            MaintenanceAlert.vehicle_id == vehicle.id,
            MaintenanceAlert.rule_name == rule_name,
            MaintenanceAlert.resolved == False
        ).first()

        if existing:
            return None

        alert = MaintenanceAlert(
            vehicle_id=vehicle.id,
            company_id=vehicle.company_id,
            rule_name=rule_name,
            severity="warning",
            due_km=None,
            current_km=vehicle.mileage
        )

        db.add(alert)
        return alert

    # -------------------------
    # DASHBOARD
    # -------------------------
    @staticmethod
    def get_dashboard(db: Session, company_id: int):

        alerts = db.query(MaintenanceAlert).filter(
            MaintenanceAlert.company_id == company_id,
            MaintenanceAlert.resolved == False
        ).all()

        return {
            "total_alerts": len(alerts),
            "warning": len([a for a in alerts if a.severity == "warning"]),
            "critical": len([a for a in alerts if a.severity == "critical"]),
            "vehicles_at_risk": len(set([a.vehicle_id for a in alerts])),
            "alerts": alerts[:20]
        }

    # -------------------------
    # FULL SCAN
    # -------------------------
    @staticmethod
    def run_full_scan(db: Session, company_id: int):

        vehicles = db.query(Vehicle).filter(
            Vehicle.company_id == company_id
        ).all()

        result = []

        for v in vehicles:
            alerts = MaintenanceService.check_vehicle(db, v)

            result.append({
                "vehicle_id": v.id,
                "alerts_created": len(alerts)
            })

        return result
    

    @staticmethod
    def compute_risk_score(db: Session, vehicle: Vehicle):

        alerts = db.query(MaintenanceAlert).filter(
            MaintenanceAlert.vehicle_id == vehicle.id,
            MaintenanceAlert.resolved == False
        ).all()

        score = 0

        # base risk
        score += len(alerts) * 10

        # mileage risk
        if vehicle.mileage > 200000:
            score += 40
        elif vehicle.mileage > 100000:
            score += 20

        # inspection risk
        if vehicle.technical_inspection_expiry_date:
            if vehicle.technical_inspection_expiry_date < date.today():
                score += 40

        # insurance risk
        if vehicle.insurance_expiry_date:
            if vehicle.insurance_expiry_date < date.today():
                score += 30

        # clamp
        score = min(score, 100)

        if score < 30:
            level = "healthy"
        elif score < 60:
            level = "attention"
        elif score < 80:
            level = "risk"
        else:
            level = "critical"

        return {
            "score": score,
            "level": level
        }