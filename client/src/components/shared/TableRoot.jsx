import { useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { columns, initialRows, gridOptions } from '../../configs/gridConfig';
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
	const [rowData, setRowData] = useState(initialRows);
	const [clipboardData, setClipboardData] = useState(null);
	const [startCell, setStartCell] = useState(null);

	const onCellValueChanged = useCallback(
		(params) => {
			const newRowData = [...rowData];
			const rowIndex = params.rowIndex;
			const field = params.column.colId;
			let newValue = params.newValue;

			if (typeof newValue === 'string' && newValue.startsWith('=')) {
				newValue = evaluateFormula(newValue.substring(1), params.api);
			}

			console.log('newValue', newValue);
			console.log(newRowData[rowIndex][field]);

			newRowData[rowIndex][field] = newValue;
			console.log(newRowData[rowIndex][field]);
			setFunctionValue(newValue);
			setRowData(newRowData);

			// Обновляем зависимые ячейки
			updateDependentCells(params.api, field, rowIndex);
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
