from app.models.maintenance_alert import MaintenanceAlert


class AlertEngine:

    @staticmethod
    def format(alerts):

        return [
            {
                "vehicle_id": a.vehicle_id,
                "type": a.rule_name,
                "severity": a.severity,
                "message": "active alert"
            }
            for a in alerts
        ]