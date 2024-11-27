import sys
import pandas as pd
import json

def analyze_ticket_data(json_data):
    # Convertir los datos JSON a un DataFrame
    df = pd.DataFrame(json_data)

    # Convertir el campo time_spent a numérico
    df["time_spent"] = pd.to_numeric(df["time_spent"], errors="coerce")

    # Función para calcular métricas generales
    def calculate_metrics(data):
        return {
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

    # Calcular métricas por org_name
    metrics_by_org = {
        org: calculate_metrics(group) for org, group in df.groupby("org_name")
    }

    # Calcular métricas por service_name
    metrics_by_service = {
        service: calculate_metrics(group) for service, group in df.groupby("service_name")
    }

    # Calcular métricas por operational_status
    metrics_by_status = {
        status: calculate_metrics(group) for status, group in df.groupby("operational_status")
    }
    
    # Calcular métricas por team_id_friendlyname
    # metrics_by_team = {
    #     team: calculate_metrics(group) for team, group in df.groupby("team_id_friendlyname")
    # }

    # Organizar los resultados en un diccionario
    result = {
        "overall_metrics": overall_metrics,
        "metrics_by_org": metrics_by_org,
        "metrics_by_service": metrics_by_service,
        "metrics_by_status": metrics_by_status,
        #"metrics_by_team": metrics_by_team
    }

    # Devolver el resultado en formato JSON
    return result

if __name__ == "__main__":
    # Leer los datos JSON de stdin
    input_data = json.load(sys.stdin)
    # Procesar los datos
    output_data = analyze_ticket_data(input_data)
    # Escribir el resultado en formato JSON en stdout
    print(json.dumps(output_data, indent=4))
