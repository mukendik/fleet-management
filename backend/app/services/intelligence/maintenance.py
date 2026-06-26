from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.models.maintenance_rule import MaintenanceRule
from app.models.maintenance_alert import MaintenanceAlert


class MaintenanceRulesEngine:

    @staticmethod
    def check_vehicle_rules(db: Session, vehicle: Vehicle):

        rules = db.query(MaintenanceRule).filter(
            MaintenanceRule.company_id == vehicle.company_id
        ).all()

        alerts = []

        for rule in rules:

            # =====================
            # KM BASED RULES
            # =====================
            if rule.interval_km is not None:

                next_due = (vehicle.mileage or 0) + rule.interval_km
                warning_threshold = next_due - (rule.warning_before_km or 0)

                if vehicle.mileage and vehicle.mileage >= warning_threshold:

                    alert = MaintenanceRulesEngine._create_km_alert(
                        db, vehicle, rule, next_due
                    )

                    if alert:
                        alerts.append(alert)

            # =====================
            # INSPECTION
            # =====================
            if rule.name.lower() == "inspection":
                if vehicle.technical_inspection_expiry_date and \
                   vehicle.technical_inspection_expiry_date <= date.today() + timedelta(days=30):

                    alert = MaintenanceRulesEngine._create_simple_alert(
                        db, vehicle, rule.name, "inspection expiring soon"
                    )
                    if alert:
                        alerts.append(alert)

            # =====================
            # INSURANCE
            # =====================
            if rule.name.lower() == "insurance":
                if vehicle.insurance_expiry_date and \
                   vehicle.insurance_expiry_date <= date.today() + timedelta(days=30):

                    alert = MaintenanceRulesEngine._create_simple_alert(
                        db, vehicle, rule.name, "insurance expiring soon"
                    )
                    if alert:
                        alerts.append(alert)

        db.commit()
        return alerts

    # =====================
    # INTERNAL HELPERS
    # =====================

    @staticmethod
    def _create_km_alert(db, vehicle, rule, next_due):

        existing = db.query(MaintenanceAlert).filter(
            MaintenanceAlert.vehicle_id == vehicle.id,
            MaintenanceAlert.rule_name == rule.name,
            MaintenanceAlert.resolved == False
        ).first()

        if existing:
            return None

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
        return alert

    @staticmethod
    def _create_simple_alert(db, vehicle, rule_name, reason):

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