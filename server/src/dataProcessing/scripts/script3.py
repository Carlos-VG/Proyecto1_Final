import sys
import json
import numpy as np
from collections import defaultdict


def determine_dynamic_ranges(time_spent_values):
    q1, q2, q3 = np.percentile(time_spent_values, [25, 50, 75])
    return {
        "Muy insatisfecho": (q3, np.inf),
        "Insatisfecho": (q2, q3),
        "Neutral": (q1, q2),
        "Satisfecho": (0, q1),
    }


def classify_satisfaction(avg_time, ranges):
    for level, (low, high) in ranges.items():
        if low <= avg_time < high:
            return level
    return "Muy insatisfecho"


def process_user_satisfaction(data):
    satisfaction_levels = {
        "Muy insatisfecho": [],
        "Insatisfecho": [],
        "Neutral": [],
        "Satisfecho": [],
        "Muy satisfecho": [],
    }

    service_stats = defaultdict(
        lambda: {
            "total_time_spent": 0,
            "request_count": 0,
            "subcategory": defaultdict(
                lambda: {"total_time_spent": 0, "request_count": 0}
            ),
        }
    )

    time_spent_values = []

    for item in data:
        service_name = item["service_name"]
        subcategory = item.get("servicesubcategory_name") or service_name
        time_spent = int(item["time_spent"])

        time_spent_values.append(time_spent)
        service_stats[service_name]["total_time_spent"] += time_spent
        service_stats[service_name]["request_count"] += 1
        service_stats[service_name]["subcategory"][subcategory][
            "total_time_spent"
        ] += time_spent
        service_stats[service_name]["subcategory"][subcategory]["request_count"] += 1

    ranges = determine_dynamic_ranges(time_spent_values)

    for service, stats in service_stats.items():
        for subcategory, sub_stats in stats["subcategory"].items():
            avg_time = sub_stats["total_time_spent"] / sub_stats["request_count"]
            satisfaction = classify_satisfaction(avg_time, ranges)
            satisfaction_levels[satisfaction].append(
                {
                    "service_name": service,
                    "subcategory_name": subcategory,
                    "average_time_spent": avg_time,
                    "request_count": sub_stats["request_count"],
                }
            )

    total_requests = sum(
        len(satisfaction_levels[level]) for level in satisfaction_levels
    )
    satisfaction_percentages = {
        level: (
            (len(satisfaction_levels[level]) / total_requests) * 100
            if total_requests
            else 0
        )
        for level in satisfaction_levels
    }

    return {
        "satisfaction_levels": satisfaction_levels,
        "satisfaction_percentages": satisfaction_percentages,
    }


def main():
    input_data = sys.stdin.read().encode("utf-8").decode("utf-8")
    data = json.loads(input_data)
    result = process_user_satisfaction(data)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
