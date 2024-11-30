from django.urls import path
from . import views

urlpatterns = [
    path('tables/', views.getAllTables),
    path('tables/<int:pk>/', views.getTableById),
    path('tables/update/<int:pk>/', views.updateTableById),
    path('tables/create/', views.createTable),
    path('cells/', views.getAllCells),
    path('cells/<int:pk>/', views.getCellById),
    path('tables/<int:pk>/cells/', views.getCellsByTableId),
    path('cells/update/<int:pk>/', views.updateCellById),
    path('cells/create/', views.createCell),
    path('formulas/', views.getAllFormulas), 
    path('formulas/<int:pk>/', views.getFormulaById), 
    path('formulas/delete/<int:pk>/', views.deleteCustomFormula),
    path('formulas/update/<int:pk>/', views.updateFormulaById),
    path('formulas/create/', views.createFormula),
]