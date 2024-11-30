import { useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FunctionSquareIcon } from 'lucide-react';

const FunctionPanel = ({
	selectedCell,
	functionValue,
	setFunctionValue,
	gridRef,
}) => {
	const inputRef = useRef(null);

	// Обновляем значение в input при выборе ячейки
	useEffect(() => {
		if (selectedCell && gridRef.current) {
			const [cellRef] = selectedCell.split(':');
			const column = cellRef.match(/[A-Z]+/)[0];
			const row = parseInt(cellRef.match(/\d+/)[0]) - 1;

			const api = gridRef.current.api;
			const rowNode = api.getDisplayedRowAtIndex(row);
			if (rowNode) {
				const cellValue = rowNode.data[column] || '';
				setFunctionValue(cellValue);
			}
		}
	}, [selectedCell]);

	const onChangeFunction = (e) => {
		const newValue = e.target.value;
		setFunctionValue(newValue);

		if (selectedCell && gridRef.current) {
			const [cellRef] = selectedCell.split(':');
			const column = cellRef.match(/[A-Z]+/)[0];
			const row = parseInt(cellRef.match(/\d+/)[0]) - 1;

			const api = gridRef.current.api;
			const rowNode = api.getDisplayedRowAtIndex(row);
			if (rowNode) {
				// Если значение начинается с '=', обрабатываем как формулу
				if (newValue.startsWith('=')) {
					try {
						const result = eval(newValue.substring(1));
						rowNode.setDataValue(column, result);
					} catch (error) {
						rowNode.setDataValue(column, newValue);
						console.log(error);
					}
				} else {
					rowNode.setDataValue(column, newValue);
				}
			}
		}
	};

	return (
		<div className='flex flex-1 justify-between items-stretch gap-2 ml-4'>
			<FunctionSquareIcon size={40} className='text-primary' />
			<div className='flex flex-1 justify-center items-stretch'>
				<Input
					ref={inputRef}
					value={functionValue}
					onChange={onChangeFunction}
					placeholder='Введите значение или формулу (Например: =2+2)'
					className='rounded-r-none w-full h-full'
					disabled={!selectedCell}
				/>
				<div className='flex justify-center items-center bg-muted px-4 rounded-r-sm'>
					<span className='text-muted-foreground text-nowrap'>
						{selectedCell ? selectedCell : 'Ячейка не выбрана'}
					</span>
				</div>
			</div>
			<Button>Все функции</Button>
		</div>
	);
};

export default FunctionPanel;
