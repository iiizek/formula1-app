# Generated by Django 5.1.2 on 2024-11-29 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cell',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]