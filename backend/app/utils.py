def parse_id(value, field_name):
    if value is None or value == "":
        return None, None
    try:
        return int(value), None
    except (ValueError, TypeError):
        return None, f"{field_name} must be a number"

