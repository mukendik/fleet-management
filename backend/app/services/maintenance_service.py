from datetime import date, datetime
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.models.maintenance_rule import MaintenanceRule
from app.models.maintenance_alert import MaintenanceAlert


# =========================
# CORE ENGINE
# =========================

class MaintenanceService:

    @staticmethod
    def check_vehicle(db: Session, vehicle: Vehicle):
        """
        Analyse un véhicule et génère des alertes maintenance si nécessaire
        """

        rules = db.query(MaintenanceRule).filter(
            MaintenanceRule.company_id == vehicle.company_id
        ).all()

        alerts_created = []

        for rule in rules:

            # -------------------------
            # KM-based rules
            # -------------------------
            if rule.interval_km:

                due_km = (vehicle.mileage or 0) + rule.interval_km

                # WARNING THRESHOLD
                warning_threshold = due_km - rule.warning_before_km

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
                            due_km=due_km,
                            current_km=vehicle.mileage,
                            severity="warning"
                        )

                        db.add(alert)
                        alerts_created.append(alert)

        db.commit()
        return alerts_created

    # =========================
    # DASHBOARD
    # =========================

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
            "alerts": alerts[:20]
        }

    # =========================
    # AUTO CHECK ALL VEHICLES
    # =========================

    @staticmethod
    def run_full_scan(db: Session, company_id: int):

        vehicles = db.query(Vehicle).filter(
            Vehicle.company_id == company_id
        ).all()

        results = []

        for v in vehicles:
            alerts = MaintenanceService.check_vehicle(db, v)
            results.append({
                "vehicle_id": v.id,
                "alerts_created": len(alerts)
            })

        return results