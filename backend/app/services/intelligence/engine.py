from datetime import datetime


def build_vehicle_intelligence(vehicle, alerts):
    """
    Central intelligence engine for vehicle dashboard.
    Returns structured payload for frontend.
    """

    # -------------------------
    # VEHICLE SERIALIZATION
    # -------------------------
    vehicle_data = {
        "id": vehicle.id,
        "name": vehicle.name,
        "brand": vehicle.brand,
        "model": vehicle.model,
        "plate_number": vehicle.plate_number,

        # ✅ missing fields FIXED
        "vin_number": vehicle.vin_number,
        "year": vehicle.year,
        "mileage": vehicle.mileage,
        "fuel_type": vehicle.fuel_type,
        "transmission": vehicle.transmission,

        "status": vehicle.status,
    }

    # -------------------------
    # INTELLIGENCE SCORE (MVP LOGIC)
    # -------------------------
    risk_score = compute_risk_score(vehicle, alerts)

    intelligence = {
        "risk_score": risk_score,
        "risk_level": get_risk_level(risk_score),
    }

    # -------------------------
    # MAINTENANCE ALERTS
    # -------------------------
    maintenance_alerts = [
        {
            "id": alert.id,
            "rule_name": alert.rule_name,
            "severity": alert.severity,
            "due_km": alert.due_km,
            "current_km": alert.current_km,
        }
        for alert in alerts
    ]

    # -------------------------
    # TIMELINE (MVP simple)
    # -------------------------
    timeline = build_timeline(vehicle, alerts)

    # -------------------------
    # FINAL RESPONSE
    # -------------------------
    return {
        "vehicle": vehicle_data,
        "intelligence": intelligence,
        "maintenance": {
            "alerts": maintenance_alerts,
            "timeline": timeline,
        },
    }


# =========================================================
# RISK ENGINE (simple MVP, extensible)
# =========================================================

def compute_risk_score(vehicle, alerts):
    """
    Basic heuristic scoring (MVP version).
    Upgrade later with ML or rules engine.
    """

    score = 0

    # mileage risk
    if vehicle.mileage and vehicle.mileage > 300000:
        score += 40
    elif vehicle.mileage and vehicle.mileage > 200000:
        score += 20

    # alerts risk
    for alert in alerts:
        if alert.severity == "critical":
            score += 30
        elif alert.severity == "warning":
            score += 10

    # cap
    return min(score, 100)


def get_risk_level(score: int):
    if score >= 70:
        return "high"
    elif score >= 40:
        return "medium"
    return "low"


# =========================================================
# TIMELINE BUILDER
# =========================================================

def build_timeline(vehicle, alerts):
    """
    Simple maintenance timeline generator (MVP).
    """

    timeline = []

    if vehicle.next_service_km:
        timeline.append({
            "label": "Next service",
            "km": vehicle.next_service_km,
            "date": None,
        })
    else:
        # fallback basé sur mileage
        timeline.append({
            "label": "Next recommended service",
            "km": vehicle.mileage + 2000,
            "date": None,
        })

    # optional: next inspection
    if vehicle.next_inspection_date:
        timeline.append({
            "label": "Technical inspection",
            "km": None,
            "date": vehicle.next_inspection_date.isoformat() if vehicle.next_inspection_date else None,
        })

    return timeline