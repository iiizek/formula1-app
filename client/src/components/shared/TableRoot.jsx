import { useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { columns, gridOptions } from '../../configs/gridConfig';
import { evaluateFormula } from '../../utils/evaluateFormula';
import { useEffect } from 'react';

const ExcelLikeGrid = ({
	setSelectedCell,
	gridRef,
	onCellFocused,
	isDarkTheme,
	setFunctionValue,
	selectedCell,
}) => {
	const { tableId } = useParams(null);

	const [rowData, setRowData] = useState();
	const [clipboardData, setClipboardData] = useState(null);
	const [startCell, setStartCell] = useState(null);

	useEffect(() => {
		const getCellsForTable = async () => {
			try {
				const { data } = await axios.get(
					`http://localhost:8000/ruxel/api/v1/tables/${tableId}/cells/?format=json`
				);

				return data;
			} catch (err) {
				console.log(err);
			}
		};

		const data = getCellsForTable();

		data.then((data) => {
			initializeGrid(data);
		});
	}, []);

	const initializeGrid = (data) => {
		const rows = Array.from({ length: 101 }, (_, rowIndex) => {
			const rowObj = { id: rowIndex + 1 };
			columns.forEach((col) => {
				rowObj[col.field] = '';
			});
			return rowObj;
		});

		data.forEach((item) => {
			const rowIndex = parseInt(item.row) - 1;
			const colField = String.fromCharCode(65 + parseInt(item.column) - 1);
			if (
				rowIndex >= 0 &&
				rowIndex < 101 &&
				colField >= 'A' &&
				colField <= 'Z'
			) {
				rows[rowIndex][colField] = item.value;
			}
		});

		setRowData(rows);
	};

	const updateCellInDatabase = async (row, column, value) => {
		try {
			const response = await fetch(
				'http://localhost:8000/ruxel/api/v1/cells/create/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						table_id: tableId,
						row: row.toString(),
						column: column.toString(),
						value: value.toString(),
					}),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update cell in database');
			}

			const result = await response.json();
			console.log('Cell updated in database:', result);
		} catch (error) {
			console.error('Error updating cell in database:', error);
		}
	};

	const onCellValueChanged = useCallback(
		(params) => {
			const newRowData = [...rowData];
			const rowIndex = params.rowIndex;
			const field = params.column.colId;
			let newValue = params.newValue;

			if (typeof newValue === 'string' && newValue.startsWith('=')) {
				newValue = evaluateFormula(newValue.substring(1), params.api);
			}

			newRowData[rowIndex][field] = newValue;
			setRowData(newRowData);

			updateDependentCells(params.api, field, rowIndex);

			const columnIndex = field.charCodeAt(0) - 64; // Преобразуем букву в число (A=1, B=2, ...)
			updateCellInDatabase(rowIndex + 1, columnIndex, newValue);
		},
		[rowData]
	);

	const updateDependentCells = useCallback((api, changedColumn, changedRow) => {
		api.forEachNode((rowNode) => {
			Object.keys(rowNode.data).forEach((field) => {
				const cellValue = rowNode.data[field];
				if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
					const updatedValue = evaluateFormula(cellValue.substring(1), api);
					if (updatedValue !== cellValue) {
						rowNode.setDataValue(field, updatedValue);
						// Обновляем зависимую ячейку в базе данных
						const columnIndex = field.charCodeAt(0) - 64;
						updateCellInDatabase(
							rowNode.rowIndex + 1,
							columnIndex,
							updatedValue
						);
					}
				}
			});
		});
	}, []);

	// Обработчик выделения диапазона ячеек
	const onRangeSelectionChanged = useCallback((params) => {
		const cellRanges = params.api.getCellRanges();
		if (cellRanges && cellRanges.length > 0) {
			const range = cellRanges[0];
			const startCol = range.startColumn.colId;
			const startRow = range.startRow.rowIndex + 1;
			const endCol = range.endColumn.colId;
			const endRow = range.endRow.rowIndex + 1;

			if (startCol === endCol && startRow === endRow) {
				setSelectedCell(`${startCol}${startRow}`);
			} else {
				setSelectedCell(`${startCol}${startRow}:${endCol}${endRow}`);
			}
		}
	}, []);

	// Функция для копирования выделенных ячеек
	const copySelectedCells = useCallback(() => {
		const api = gridRef.current.api;
		const cellRanges = api.getCellRanges();

		if (!cellRanges || cellRanges.length === 0) return;

		const range = cellRanges[0];
		const startRow = range.startRow.rowIndex;
		const endRow = range.endRow.rowIndex;
		const startCol = columns.findIndex(
			(col) => col.field === range.startColumn.colId
		);
		const endCol = columns.findIndex(
			(col) => col.field === range.endColumn.colId
		);

		// Создаем массив скопированных данных
		const copiedData = {
			rows: endRow - startRow + 1,
			cols: endCol - startCol + 1,
			values: [],
		};

		for (let i = startRow; i <= endRow; i++) {
			const rowData = [];
			for (let j = startCol; j <= endCol; j++) {
				const colId = columns[j].field;
				const value = api.getValue(colId, api.getDisplayedRowAtIndex(i));
				rowData.push(value);
			}
			copiedData.values.push(rowData);
		}

		setClipboardData(copiedData);
	}, []);

	// Функция для вставки данных
	const pasteToSelectedCells = useCallback(() => {
		if (!clipboardData) return;

		const api = gridRef.current.api;
		const cellRanges = api.getCellRanges();

		if (!cellRanges || cellRanges.length === 0) return;

		const range = cellRanges[0];
		const startRow = range.startRow.rowIndex;
		const startCol = columns.findIndex(
			(col) => col.field === range.startColumn.colId
		);

		// Вставляем данные
		for (let i = 0; i < clipboardData.rows; i++) {
			for (let j = 0; j < clipboardData.cols; j++) {
				const rowIndex = startRow + i;
				const colIndex = startCol + j;

				if (colIndex < columns.length) {
					const rowNode = api.getDisplayedRowAtIndex(rowIndex);
					if (rowNode) {
						const value = clipboardData.values[i][j];
						const colId = columns[colIndex].field;
						rowNode.setDataValue(colId, value);
					}
				}
			}
		}
	}, [clipboardData]);

	// Обработчик клавиатурных сочетаний
	const onKeyDown = useCallback(
		(event) => {
			if (event.ctrlKey || event.metaKey) {
				// metaKey для Mac
				switch (event.key) {
					case 'c':
						event.preventDefault();
						copySelectedCells();
						break;
					case 'v':
						event.preventDefault();
						pasteToSelectedCells();
						break;
				}
			}
		},
		[copySelectedCells, pasteToSelectedCells]
	);

	const onCellMouseDown = (params) => {
		if (!params.column || !params.column.colId) {
			console.warn('Invalid params in onCellMouseDown:', params);
			return;
		}
		setStartCell(params);
	};

	const onCellMouseUp = (params) => {
		if (!startCell || !params.column || !params.column.colId) {
			console.warn('Invalid params in onCellMouseUp:', params);
			return;
		}

		if (params.column.getId() === startCell.column.getId()) {
			const startRowIndex = Math.min(startCell.rowIndex, params.rowIndex);
			const endRowIndex = Math.max(startCell.rowIndex, params.rowIndex);

			const updatedRowData = [...rowData];
			for (let i = startRowIndex; i <= endRowIndex; i++) {
				updatedRowData[i][params.column.colId] = startCell.value;
			}

			setRowData(updatedRowData);
		}
		setStartCell(null);
	};

	useEffect(() => {
		console.log('rowData', JSON.stringify(rowData));
	}, []);

	return (
		<div
			onKeyDown={onKeyDown}
			tabIndex='0'
			className={isDarkTheme ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'}
			style={{ height: '70.7vh', width: '100%' }}
		>
			<AgGridReact
				ref={gridRef}
				columnDefs={columns}
				rowData={rowData}
				gridOptions={gridOptions}
				onCellValueChanged={onCellValueChanged}
				onCellFocused={onCellFocused}
				enableRangeSelection={true}
				suppressCopyRowsToClipboard={true}
				suppressCopySingleCellRanges={true}
				onRangeSelectionChanged={onRangeSelectionChanged}
				onCellMouseDown={onCellMouseDown}
				onCellMouseUp={onCellMouseUp}
				getRowId={(params) => params.data.id}
			/>
		</div>
	);
};

export default ExcelLikeGrid;
