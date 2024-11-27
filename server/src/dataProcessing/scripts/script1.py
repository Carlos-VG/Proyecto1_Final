import sys
import pandas as pd
import json

def analyze_ticket_data(json_data, filters):
    # Convertir los datos JSON a un DataFrame
    df = pd.DataFrame(json_data)

    # Convertir el campo time_spent a numérico
    df["time_spent"] = pd.to_numeric(df["time_spent"], errors="coerce")

    # Función para calcular métricas generales
    def calculate_metrics(data):
        return {
            "request_count": len(data),
            "avg_time_by_priority": data.groupby("priority")["time_spent"].mean().round(2).to_dict(),
            "avg_time_by_request_type": data.groupby("request_type")["time_spent"].mean().round(2).to_dict(),
            "avg_time_by_urgency": data.groupby("urgency")["time_spent"].mean().round(2).to_dict(),
            "avg_time_by_origin": data.groupby("origin")["time_spent"].mean().round(2).to_dict(),
            "avg_time_by_impact": data.groupby("impact")["time_spent"].mean().round(2).to_dict(),
            "most_frequent_request_type": data["request_type"].value_counts().idxmax(),
            "overall_avg_time_spent": data["time_spent"].mean().round(2)
        }

    # Resultados generales
    overall_metrics = calculate_metrics(df)

    # Diccionario para almacenar las métricas por columna filtrada
    result = {
        "overall_metrics": overall_metrics,
    }

    # Iterar sobre los filtros y generar métricas solo para las columnas solicitadas
    for filter_column in filters:
        if filter_column in df.columns:  # Asegúrate de que la columna exista en el DataFrame
            # Generar las métricas para esta columna de filtro
            result[f"metrics_by_{filter_column}"] = {
                group_value: calculate_metrics(group) for group_value, group in df.groupby(filter_column)
            }

    # Devolver el resultado en formato JSON
    return result

if __name__ == "__main__":
    # Leer los datos JSON de stdin
    input_data = json.load(sys.stdin)

    # Leer los filtros enviados en la entrada estándar
    filters = input_data.get('filters', [])

    # Eliminar la clave 'filters' del input_data antes de procesar
    input_data = input_data.get('data', input_data)

    # Procesar los datos
    output_data = analyze_ticket_data(input_data, filters)

    # Escribir el resultado en formato JSON en stdout
    print(json.dumps(output_data, indent=4))
