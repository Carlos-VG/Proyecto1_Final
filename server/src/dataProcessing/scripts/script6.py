import sys
import pandas as pd
import json

def analyze_operational_status(json_data, filters):
    # Convertir los datos JSON a un DataFrame
    df = pd.DataFrame(json_data)

    # Diccionario para almacenar los resultados
    result = {
        "overall_metrics": {},
        "metrics_by_filters": {}
    }

    # Función para calcular métricas generales
    def calculate_status_metrics(data):
        total = len(data)
        counts = data["status"].value_counts().to_dict()
        percentages = {status: round((count / total) * 100, 2) for status, count in counts.items()}
        return {
            "counts": counts,
            "total": total,
            "percentage": percentages
        }

    # Calcular métricas generales (overall)
    result["overall_metrics"] = calculate_status_metrics(df)

    # Calcular métricas adicionales basadas en los filtros
    for filter_column in filters:
        if filter_column in df.columns:  # Asegurarse de que la columna existe
            result["metrics_by_filters"][filter_column] = {
                group_value: calculate_status_metrics(group)
                for group_value, group in df.groupby(filter_column)
            }

    return result

if __name__ == "__main__":
    # Leer los datos JSON de stdin
    input_data = json.load(sys.stdin)
    # Leer los filtros enviados en la entrada estándar
    filters = input_data.get("filters", [])
    # Eliminar la clave 'filters' del input_data antes de procesar
    data = input_data.get("data", input_data)
    # Procesar los datos
    output_data = analyze_operational_status(data, filters)
    # Escribir el resultado en formato JSON en stdout
    print(json.dumps(output_data, indent=4, ensure_ascii=False))
