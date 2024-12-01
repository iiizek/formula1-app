import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '../components/ui/card';

import { ChevronLeft } from 'lucide-react';
import TableRoot from '../components/shared/TableRoot';
import FunctionPanel from '../components/shared/FunctionPanel';

const TablePage = ({ isDarkTheme }) => {
	const gridRef = useRef();

	const [selectedCell, setSelectedCell] = useState('');
	const [functionValue, setFunctionValue] = useState('');

	const getCellValue = () => {
		if (!gridRef.current || !selectedCell) return '';

		const [cellRef] = selectedCell.split(':'); // Берем первую ячейку из диапазона
		const column = cellRef.match(/[A-Z]+/)[0];
		const row = parseInt(cellRef.match(/\d+/)[0]) - 1;

		const api = gridRef.current.api;
		const rowNode = api.getDisplayedRowAtIndex(row);
		setFunctionValue(rowNode ? rowNode.data[column] : '');
	};

	// Обработчик выбора ячейки
	const onCellFocused = useCallback((params) => {
		if (params.column && params.rowIndex !== null) {
			if (params.column.colId === 'rowNum') return;

			const columnName = params.column.colId;
			const rowNumber = params.rowIndex + 1;
			const cellReference = `${columnName}${rowNumber}`;
			setSelectedCell(cellReference);

			// Получаем значение выбранной ячейки
			const cellValue = params.api.getValue(params.column.colId, params.node);
			setFunctionValue(cellValue || '');
		}
	}, []);

	useEffect(() => {
		getCellValue();
	}, [selectedCell]);

	return (
		<Card className='flex flex-col justify-between h-[80.5vh]'>
			<CardHeader>
				<div className='flex justify-between items-center gap-4'>
					<Link to={'/'}>
						<ChevronLeft
							size={42}
							className='hover:opacity-75 text-primary transition-all cursor-pointer'
						/>
					</Link>

					<div>
						<CardTitle>Таблица 1</CardTitle>
						<CardDescription>Создана: 29.01.2005 12:00</CardDescription>
					</div>

					<FunctionPanel
						functionValue={functionValue}
						getCellValue={getCellValue}
						selectedCell={selectedCell}
						setFunctionValue={setFunctionValue}
						gridRef={gridRef}
					/>
				</div>
			</CardHeader>

			<CardContent className='flex-1 p-0'>
				<TableRoot
					setFunctionValue={setFunctionValue}
					isDarkTheme={isDarkTheme}
					gridRef={gridRef}
					selectedCell={selectedCell}
					setSelectedCell={setSelectedCell}
					onCellFocused={onCellFocused}
				/>
			</CardContent>
		</Card>
	);
};

export default TablePage;
