import sys
import pandas as pd
import json

def analyze_ticket_data(json_data, filters):
    # Convertir los datos JSON a un DataFrame
    df_all = pd.DataFrame(json_data)

    # Filtrar el DataFrame para obtener solo los requerimientos resueltos o cerrados
    df_resolved = df_all[df_all['operational_status'].isin(['resolved', 'closed'])]

    # Función para calcular la cantidad de requerimientos por estado
    def calculate_metrics(data):
        return {
            "request_count": len(data),
            "request_count_by_state": data["operational_status"].value_counts().to_dict()
        }

    # Diccionario para almacenar las métricas por columna filtrada
    result = {}

    # Métricas para el DataFrame con todos los datos
    result["metrics_all"] = calculate_metrics(df_all)

    # Métricas para el DataFrame con solo los datos resueltos o cerrados
    result["metrics_resolved"] = calculate_metrics(df_resolved)

    # Iterar sobre los filtros y generar métricas solo para las columnas solicitadas
    for filter_column in filters:
        if filter_column in df_all.columns:  # Asegúrate de que la columna exista en el DataFrame
            # Generar las métricas para esta columna de filtro para el DataFrame con todos los datos
            result[f"metrics_by_{filter_column}_all"] = {
                group_value: calculate_metrics(group) for group_value, group in df_all.groupby(filter_column)
            }
        
        if filter_column in df_resolved.columns:  # Asegúrate de que la columna exista en el DataFrame resuelto
            # Generar las métricas para esta columna de filtro para el DataFrame con solo los resueltos o cerrados
            result[f"metrics_by_{filter_column}_resolved"] = {
                group_value: calculate_metrics(group) for group_value, group in df_resolved.groupby(filter_column)
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
    print(json.dumps(output_data, indent=4, ensure_ascii=False))
