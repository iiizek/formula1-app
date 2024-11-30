from rest_framework import serializers
from .models import Table, Cell, Formula


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'


# class CellSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Cell
#         fields = '__all__'


class CellSerializer(serializers.ModelSerializer):
    table_id = serializers.IntegerField(source='table.id', read_only=True)

    class Meta:
        model = Cell
        fields = ['id', 'table_id', 'row', 'column', 'value', 'created_at', 'changed_at']


class FormulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formula
        fields = '__all__'