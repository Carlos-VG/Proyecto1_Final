import sys
import json
from collections import defaultdict

# Función para calcular el porcentaje de implementación de requerimientos aprobados
def calculate_implementation_percentage(data, desired_columns):
    # Inicializamos un contador de requerimientos aprobados e implementados
    total_approved = 0
    implemented = 0
    
    for requirement in data:
        # Filtramos solo las columnas deseadas
        filtered_data = {key: requirement.get(key) for key in desired_columns}
        
        # Extraemos el estado y si está implementado
        status = filtered_data.get('operational_status')  # Estado del requerimiento
        
        # Solo contamos los requerimientos aprobados
        if status == "resolved":
            total_approved += 1  # Incrementamos los requerimientos aprobados
            # Se considera implementado si el estado es 'approved'
            implemented += 1

    # Calculamos el porcentaje de implementación
    implementation_percentage = (implemented / total_approved) * 100 if total_approved > 0 else 0
    
    return round(implementation_percentage, 2)

def main():
    # Verifica si se pasó un argumento para el tipo de filtro
    if len(sys.argv) > 1:
        filter_type = sys.argv[1]
    else:
        filter_type = None
        
    # Leemos los datos de entrada en JSON desde stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    
    # Lista de columnas deseadas
    desired_columns = [
        'ref',
        'operational_status',
        'agent_id',
        'agent_id_friendlyname',
        'team_id',
        'team_id_friendlyname',
        'time_spent',
    ]
    
    # Calculamos el porcentaje de implementación de requerimientos aprobados
    result = calculate_implementation_percentage(data, desired_columns)
    
    # Filtramos el resultado si es necesario (por ejemplo, 'resolved' o 'closed')
    if filter_type:
        if filter_type == "resolved":
            result = {"implementation_percentage": result if result > 0 else 0}
        elif filter_type == "closed":
            result = {"implementation_percentage": result if result == 100 else 0}

    # Imprimimos el resultado en formato JSON para que se devuelva al servidor
    print(json.dumps({"implementation_percentage": result}, indent=4))
    
if __name__ == "__main__":
    main()
