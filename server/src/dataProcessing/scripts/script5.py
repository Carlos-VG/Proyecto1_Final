import sys
import json
from collections import defaultdict

# Función para calcular la tasa de cierre de tickets por agente (analista)
def calculate_closure_rate(data):
    tickets_by_analyst = defaultdict(lambda: {"closed": 0, "total": 0})
    
    for ticket in data:
        agent_name = ticket.get("agent_id_friendlyname")  # Nombre del agente (analista)
        status = ticket.get("operational_status")  # Estado del ticket (cerrado o no)
        
        # Aseguramos que el agente esté en el diccionario antes de contar
        if agent_name:
            tickets_by_analyst[agent_name]["total"] += 1  # Sumar tickets totales por agente
            if status == "closed":  # Si el estado es 'closed', contar como cerrado
                tickets_by_analyst[agent_name]["closed"] += 1

    # Calculamos la tasa de cierre por agente
    closure_rates = {}
    for agent_name, counts in tickets_by_analyst.items():
        total_tickets = counts["total"]
        closed_tickets = counts["closed"]
        closure_rate = closed_tickets / total_tickets if total_tickets > 0 else 0  # Tasa de cierre
        closure_rates[agent_name] = {
            "closed_tickets": closed_tickets,
            "total_tickets": total_tickets,
            "closure_rate": round(closure_rate * 100, 2)  # Tasa en porcentaje
        }

    return closure_rates

def main():
    # Verifica si se pasó un argumento para el tipo de filtro (resolved_closed)
    if len(sys.argv) > 1:
        filter_type = sys.argv[1]
    else:
        filter_type = None
        
    # Leemos los datos de entrada en JSON desde stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    
    # Calculamos la tasa de cierre de tickets por agente
    result = calculate_closure_rate(data)
    
    # Filtramos el resultado si es necesario (por ejemplo, 'resolved' o 'closed')
    if filter_type:
        if filter_type == "resolved":
            result = {agent: data for agent, data in result.items() if data["closure_rate"] > 0}
        elif filter_type == "closed":
            result = {agent: data for agent, data in result.items() if data["closure_rate"] == 100}

    # Imprimimos el resultado en formato JSON para que se devuelva al servidor
    print(json.dumps(result, indent=4))
    
if __name__ == "__main__":
    main()
