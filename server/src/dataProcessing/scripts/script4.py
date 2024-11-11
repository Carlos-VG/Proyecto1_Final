import sys
import pandas as pd
import json

def analyze_organization_data(json_data):
    # Convertir los datos JSON a un DataFrame
    df = pd.DataFrame(json_data)

    # Convertir el campo time_spent a numérico
    df["time_spent"] = pd.to_numeric(df["time_spent"], errors="coerce")

    # Calcular el total de requerimientos
    total_requests = len(df)

    # Agrupar por organización y calcular la cantidad de requerimientos, tiempo medio de resolución y porcentaje
    org_stats = df.groupby(["org_id", "org_name"]).agg(
        request_count=("ref", "count"),
        avg_resolution_time=("time_spent", "mean")
    ).reset_index().round(2)

    # Calcular el porcentaje de requerimientos por organización
    org_stats["request_percentage"] = (org_stats["request_count"] / total_requests * 100).round(2)

    # Convertir los resultados en un formato JSON amigable
    org_stats_dict = org_stats.to_dict(orient="records")

    # Organizar los resultados en un diccionario de salida
    result = {
        "organization_stats": org_stats_dict
    }

    return result

if __name__ == "__main__":
    # Leer los datos JSON de stdin
    input_data = json.load(sys.stdin)
    # Procesar los datos
    output_data = analyze_organization_data(input_data)
    # Escribir el resultado en formato JSON en stdout
    print(json.dumps(output_data))
