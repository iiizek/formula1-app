
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Table, Cell, Formula
from .serializers import TableSerializer, CellSerializer, FormulaSerializer


# Работа с запросами в таблице
@api_view(['GET'])
def getAllTables(request):
    """Получение информации о всех таблицах в базе данных.
    
    :Request Method: GET
    :URL Format: `/ruxel/api/v1/tables/`
    
    **Response Example:**
    ```
    [
        {
            "table_id": 1,
            "name": "Table 1",
            "created_at": "2024-11-30T12:00:00Z",
            "changed": "2024-11-30T12:10:00Z"
        },
        {
            "table_id": 2,
            "name": "Table 2",
            "created_at": "2024-11-29T14:00:00Z",
            "changed": "2024-11-29T14:30:00Z"
        }
    ]
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с данными всех таблиц.
    """
    
    tables = Table.objects.all()
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getTableById(request, pk):
    """Получение информации о таблице по ее id.
    
    :Request Method: GET
    :URL Format: `/ruxel/api/v1/tables/<id>/`
    :Path Paramets:
    - id (int): id таблицы.
    
    **Response Example:**
    ```
    {
        "table_id": 1,
        "name": "Table 1",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с данными таблицы по ее id.
    """
    
    table = Table.objects.get(id=pk)
    serializer = TableSerializer(table)
    return Response(serializer.data)


@api_view(['PATCH'])
def updateTableById(request, pk):
    """Изменение имени таблицы по ее id.
    
    :Request Method: Patch
    :URL Format: `/ruxel/api/v1/tables/update/<id>/`
    :Path Paramets:
    - id (int): id таблицы.
    
    **Request Body Example:**
    ```
    {
       'name': 'New Name' 
    }
    ```
    
    **Response Example:**
    ```
    {
        "table_id": 1,
        "name": "New Name",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с новыми данными таблицы после изменения имени.
    """
    
    try:
        table = Table.objects.get(id=pk)
    except Table.DoesNotExist:
        return Response({'error': 'Table not found'}, status=404)
    
    new_name = request.data.get('name')
    if not new_name:
        return Response({'error': 'Name is required'}, status=400)
    
    table.name = new_name
    table.save()
    
    serializer = TableSerializer(table)
    return Response(serializer.data)


@api_view(['POST'])
def createTable(request):
    """Создание новой таблицы.
    
    :Request Method: POST
    :URL Format: `/ruxel/api/v1/tables/create/`
    
    **Request Body Example:**
    ```
    {
       "name": "Table 1",
    }
    ```
    
    **Response Example:**
    ```
    {
        "table_id": 1,
        "name": "Table 1",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с данными новой таблицы.
    """
    
    name = request.data.get('name')
    
    if not name:
        return Response({'error': 'Value is required'}, status=400)
    
    table = Table.objects.create(name=name)
    
    serializer = TableSerializer(table)
    return Response(serializer.data)


# Работа с запросами ячеек таблицы
@api_view(['GET'])
def getAllCells(request):
    """Получение всех ячеек из всех таблиц.
    
    :Request Method: GET
    :URL Format: `/ruxel/api/v1/cells/`
    :Path Paramets:
    - id (int): id таблицы.
    
    **Response Example:**
    ```
    {
        "id": 1,
        "table_id": 1,
        "row": "A",
        "column": 1,
        "value": "Hello, World!",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    {
        "id": 2,
        "table_id": 2,
        "row": "F",
        "column": 2,
        "value": "Hello",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ со всеми ячейками из всех таблиц.
    """
    
    cells = Cell.objects.all()
    serializer = CellSerializer(cells, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getCellById(request, pk):
    """Получение информации о ячейке по её id.
    
    :Request Method: GET
    :URL Format: `/ruxel/api/v1/cells/<id>/`
    :Path Parameters:
    - id (int): id ячейки.
    
    **Response Example:**
    ```
    {
        "id": 1,
        "table": 1,
        "row": "A",
        "column": "1",
        "value": "Hello, World!",
        "created_at": "2024-11-30T12:00:00Z",
        "changed_at": "2024-11-30T12:10:00Z"
    }
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с данными ячейки по её id.
    """
    try:
        cell = Cell.objects.get(pk=pk)
        serializer = CellSerializer(cell)
        return Response(serializer.data)
    except Cell.DoesNotExist:
        return Response({"error": "Cell not found"}, status=404)


@api_view(['GET'])
def getCellsByTableId(request, pk):
    """Получение всех ячеек из таблицы по ее id.
    
    :Request Method: GET
    :URL Format: `/ruxel/api/v1/tables/<id>/cells/`
    :Path Paramets:
    - id (int): id таблицы.
    
    **Response Example:**
    ```
    {
        "id": 1,
        "table_id": 1,
        "row": "A",
        "column": 1,
        "value": "Hello, World!",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    {
        "id": 2,
        "table_id": 1,
        "row": "F",
        "column": 2,
        "value": "Hello, Worlds!",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ со всеми ячейками из таблицы по ее id.
    """
    
    try:
        table = Table.objects.get(id=pk)
    except Table.DoesNotExist:
        return Response({'error': 'Table not found'}, status=404)
    
    cells = Cell.objects.filter(table=table)
    serializer = CellSerializer(cells, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
def updateCellById(request, pk):
    """Изменение значения ячейки по ее id.
    
    :Request Method: Patch
    :URL Format: `/ruxel/api/v1/cells/update/<id>/`
    :Path Paramets:
    - id (int): id ячейки.
    
    **Request Body Example:**
    ```
    {
       'value': 'New Value' 
    }
    ```
    
    **Response Example:**
    ```
    {
        "id": 2,
        "table_id": 1,
        "row": "F",
        "column": 2,
        "value": "New Value",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с новыми данными ячейки после изменения значения.
    """
    
    try:
        cell = Cell.objects.get(id=pk)
    except Cell.DoesNotExist:
        return Response({'error': 'Cell not found'}, status=404)
    
    new_value = request.data.get('value')
    if not new_value:
        return Response({'error': 'Value is required'}, status=400)
    
    cell.value = new_value
    cell.save()
    
    serializer = CellSerializer(cell)
    return Response(serializer.data)


@api_view(['POST'])
def createCell(request):
    """Создание новой ячейки.
    
    :Request Method: POST
    :URL Format: `/ruxel/api/v1/cells/create/`
    
    **Request Body Example:**
    ```
    {
       "table_id": 1,
       "row": "A",
       "column": 1,
       "value": "Hello!!!"
    }
    ```
    
    **Response Example:**
    ```
    {
        "id": 1,
        "table_id": 1,
        "row": "A",
        "column": 1,
        "value": "Hello!!!",
        "created_at": "2024-11-30T12:00:00Z",
        "changed": "2024-11-30T12:10:00Z"
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с данными новой ячейки.
    """
    
    table_id = request.data.get('table_id')
    row = request.data.get('row')
    column = request.data.get('column')
    value = request.data.get('value')

    if not all([table_id, row, column, value]):
        return Response({'error': 'All fields (table_id, row, column, value) are required'}, status=400)

    try:
        table = Table.objects.get(id=table_id)
    except Table.DoesNotExist:
        return Response({'error': 'Table not found'}, status=404)

    # Используем update_or_create для обновления или создания ячейки
    cell, created = Cell.objects.update_or_create(
        table=table,
        row=row,
        column=column,
        defaults={'value': value}
    )

    serializer = CellSerializer(cell)
    response_data = serializer.data
    response_data['created'] = created  # Указываем, была ли ячейка создана или обновлена
    return Response(response_data)


@api_view(['GET'])
def getAllFormulas(request):
    formulas = Formula.objects.all()
    serializer = FormulaSerializer(formulas, many=True)
    return Response(serializer.data)


# Работа с запросами формул
@api_view(['GET'])
def getFormulaById(request, pk):
    """Получение формулы по id.
    
    :Request Method: GET
    :URL Format: `/ruxel/api/v1/formulas/<id>/`
    :Path Paramets:
    - id (int): id формулы.
    
    **Response Example:**
    ```
    {
        "id": 1,
        "name": "Formula 1",
        "body": "Тут я хз что вы выводите",
        "isCustom": true
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с формулой по ее id.
    """
    
    formula = Formula.objects.get(id=pk)
    serializer = FormulaSerializer(formula)
    return Response(serializer.data)


@api_view(['DELETE'])
def deleteCustomFormula(request, pk):
    """Удаление формулы по id.
    
    :Request Method: DELETE
    :URL Format: `/ruxel/api/v1/formulas/delete/<id>/`
    :Path Paramets:
    - id (int): id формулы.
    
    **Response Example:**
    ```
    {
        "message": "Formula deleted successfully."
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с сообщением об успешном удалении.
    """
    
    formula = Formula.objects.get(id=pk)
    formula.delete()
    return Response({"message": "Formula deleted successfully."})


@api_view(['PATCH'])
def updateFormulaById(request, pk):
    """Изменение имени и значения формулы по ее id.
    
    :Request Method: Patch
    :URL Format: `/ruxel/api/v1/formulas/update/<id>/`
    :Path Paramets:
    - id (int): id формклы.
    
    **Request Body Example:**
    ```
    {
       "name": "New Name",
       "body": "n + k / s"
    }
    ```
    
    **Response Example:**
    ```
    {
        "id": 1,
        "name": "New Name",
        "body": "n + k / s",
        "isCustom": true
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с новыми данными формулы после изменения ее имени и значения.
    """
    
    name = request.data.get('name')
    body = request.data.get('body')
    
    if not all([name, body]):
        return Response({"error": "Name and body are required"}, status=400)
    
    formula = Formula.objects.get(id=pk)
    formula.name = name
    formula.body = body
    formula.save()
    
    serializer = FormulaSerializer(formula)
    return Response(serializer.data)


@api_view(['POST'])
def createFormula(request):
    """Создание новой формулы.
    
    :Request Method: POST
    :URL Format: `/ruxel/api/v1/formulas/create/`
    
    **Request Body Example:**
    ```
    {
       "name": "New Formula",
       "body": "n + k / s",
       "isCustom": true
    }
    ```
    
    **Response Example:**
    ```
    {
        "id": 1,
        "name": "New Formula",
        "body": "n + k / s",
        "is_custom": true
    },
    ```
    
    :Param Request: Объект HTTP-запроса.
    :Return: JSON ответ с данными новой формулы.
    """
    
    name = request.data.get('name')
    body = request.data.get('body')
    is_custom = request.data.get('is_custom', False)
    
    if not all([name, body, is_custom]):
        return Response({"error": "Name, body and is_custom are required"}, status=400)
    
    formula = Formula.objects.create(
        name = name,
        body = body,
        is_custom = is_custom
    )
    
    serializer = FormulaSerializer(formula)
    return Response(serializer.data)