import sys
import pandas as pd
import json

def analyze_organization_data(json_data, filters):
    # Convertir los datos JSON a un DataFrame
    df = pd.DataFrame(json_data)

    # Convertir el campo time_spent a numérico
    df["time_spent"] = pd.to_numeric(df["time_spent"], errors="coerce")

    # Función para calcular métricas generales
    def calculate_metrics(data):
        return {
            "request_count": len(data),
            "avg_resolution_time": data["time_spent"].mean().round(2) if not data["time_spent"].empty else None
        }

    # Diccionario para almacenar los resultados
    result = {
        "organization_metrics": {}
    }

    # Agrupar por organización y calcular métricas
    for org_id, org_group in df.groupby("org_id"):
        org_name = org_group["org_name"].iloc[0] if "org_name" in org_group.columns else f"Organization {org_id}"

        # Calcular métricas generales de la organización
        org_metrics = calculate_metrics(org_group)

        # Calcular métricas adicionales basadas en los filtros
        for filter_column in filters:
            if filter_column in org_group.columns:  # Asegurarse de que la columna existe
                org_metrics[f"metrics_by_{filter_column}"] = {
                    group_value: calculate_metrics(group)
                    for group_value, group in org_group.groupby(filter_column)
                }

        # Agregar al resultado final
        result["organization_metrics"][f"organizacion {org_id}"] = {
            "org_id": org_id,
            "org_name": org_name,
            **org_metrics
        }

    return result

if __name__ == "__main__":
    # Leer los datos JSON de stdin
    input_data = json.load(sys.stdin)
    # Leer los filtros enviados en la entrada estándar
    filters = input_data.get("filters", [])
    # Eliminar la clave 'filters' del input_data antes de procesar
    input_data = input_data.get("data", input_data)
    # Procesar los datos
    output_data = analyze_organization_data(input_data, filters)
    # Escribir el resultado en formato JSON en stdout
    print(json.dumps(output_data, indent=4))
