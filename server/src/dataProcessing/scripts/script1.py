import sys
import pandas as pd
import json

def analyze_ticket_data(json_data):
    # Convertir los datos JSON a un DataFrame
    df = pd.DataFrame(json_data)

    # Convertir el campo time_spent a numérico
    df["time_spent"] = pd.to_numeric(df["time_spent"], errors="coerce")

    # Calcular tiempo promedio de resolución por tipo de solicitud y otros factores combinados
    #avg_resolution_time = df.groupby(["request_type", "priority", "urgency", "origin", "impact"])["time_spent"].mean().reset_index()
    #avg_resolution_time_dict = avg_resolution_time.to_dict(orient="records")

    # Calcular tiempo promedio de resolución para cada valor de priority
    avg_time_by_priority = df.groupby("priority")["time_spent"].mean().to_dict()

    # Calcular tiempo promedio de resolución para cada valor de request_type
    avg_time_by_request_type = df.groupby("request_type")["time_spent"].mean().to_dict()

    # Calcular tiempo promedio de resolución para cada valor de urgency
    avg_time_by_urgency = df.groupby("urgency")["time_spent"].mean().to_dict()

    # Calcular tiempo promedio de resolución para cada valor de origin
    avg_time_by_origin = df.groupby("origin")["time_spent"].mean().to_dict()

    # Calcular tiempo promedio de resolución para cada valor de impact
    avg_time_by_impact = df.groupby("impact")["time_spent"].mean().to_dict()

    # Identificar el tipo de resolución más frecuente
    request_type_counts = df["request_type"].value_counts()
    most_frequent_request_type = request_type_counts.idxmax()

    # Calcular tiempo medio de resolución general
    overall_avg_time_spent = df["time_spent"].mean()

    # Identificar tickets con tiempo de resolución superior al promedio
    improvement_opportunities = df[df["time_spent"] > overall_avg_time_spent].to_dict(orient="records")

    # Organizar los resultados en un diccionario
    result = {
        # "avg_resolution_time": avg_resolution_time_dict,
        "avg_time_by_priority": avg_time_by_priority,
        "avg_time_by_request_type": avg_time_by_request_type,
        "avg_time_by_urgency": avg_time_by_urgency,
        "avg_time_by_origin": avg_time_by_origin,
        "avg_time_by_impact": avg_time_by_impact,
        "most_frequent_request_type": most_frequent_request_type,
        "overall_avg_time_spent": overall_avg_time_spent,
        "improvement_opportunities": improvement_opportunities
    } 

    # Devolver el resultado en formato JSON
    return result

if __name__ == "__main__":
    # Leer los datos JSON de stdin
    input_data = json.load(sys.stdin)
    # Procesar los datos
    output_data = analyze_ticket_data(input_data)
    # Escribir el resultado en formato JSON en stdout
    print(json.dumps(output_data))
