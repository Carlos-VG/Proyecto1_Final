import sys
import pandas as pd
import json

def analyze_closure_rate(json_data):
    # Convertir los datos JSON a un DataFrame
    df = pd.DataFrame(json_data)

    # Convertir el campo time_spent a numérico
    df["time_spent"] = pd.to_numeric(df["time_spent"], errors="coerce")

    # Crear un DataFrame solo con los tickets cerrados
    closed_df = df[df["operational_status"].isin(["closed"])]

    # Calcular las métricas por analista
    result = {}
    for agent, group in df.groupby("agent_id_friendlyname"):
        closed_group = closed_df[closed_df["agent_id_friendlyname"] == agent]
        total_tickets = len(group)
        closed_tickets = len(closed_group)
        closure_rate = round((closed_tickets / total_tickets * 100), 2) if total_tickets > 0 else 0
        avg_time_spent = round(closed_group["time_spent"].mean(), 2) if not closed_group.empty else 0

        # Manejar valores NaN o nulos reemplazándolos con 0 o valores apropiados
        if pd.isna(avg_time_spent):
            avg_time_spent = 0

        result[agent] = {
            "closed_tickets": closed_tickets,
            "total_tickets": total_tickets,
            "closure_rate": closure_rate,
            "avg_closed_time_spent": avg_time_spent
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
    output_data = analyze_closure_rate(input_data)
    # Escribir el resultado en formato JSON en stdout
    print(json.dumps(output_data, indent=4, ensure_ascii=False))