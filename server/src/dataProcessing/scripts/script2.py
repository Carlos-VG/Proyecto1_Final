import sys
import json
from collections import defaultdict

# Función para contar los requisitos según el estado
def count_requirements_by_status(data, filter_type=None):
    status_counts = defaultdict(int)
    
    for item in data:
        status = item.get("operational_status")
        
        # Si el tipo de filtro es 'resolved_closed', contamos solo 'resolved' o 'closed'
        if filter_type == "resolved_closed" and status not in ["resolved", "closed"]:
            continue
        
        status_counts[status] += 1

    return dict(status_counts)

def main():
    # Verifica si se pasó un argumento para el tipo de filtro (resolved_closed)
    if len(sys.argv) > 1:
        filter_type = sys.argv[1]
    else:
        filter_type = None

    # Leemos los datos de entrada que provienen de la solicitud
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    
    # Llamamos a la función que cuenta los estados
    result = count_requirements_by_status(data, filter_type)
    
    # Imprimimos el resultado para que se devuelva al servidor
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    main()
