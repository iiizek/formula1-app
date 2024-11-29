from django.db import models

class Table(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    changed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Cell(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='cells')
    row = models.CharField(max_length=50)
    column = models.BigIntegerField()
    value = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField()
    changed_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Устанавливаем created_at как created_at таблицы
        if not self.pk:  # Только при создании новой записи
            self.created_at = self.table.created_at
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Таблица {self.table.name}, Строка {self.row}, Колонка {self.column}"


class Formula(models.Model):
    name = models.CharField(max_length=255)
    body = models.TextField()
    is_custom = models.BooleanField(default=False)

    def __str__(self):
        return self.name
