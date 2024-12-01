import { useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription,
	DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

const FormulasList = () => {
	const [formulas, setFormulas] = useState([]);

	useEffect(() => {
		const getFormulas = async () => {
			try {
				const { data } = await axios.get(
					'http://localhost:8000/ruxel/api/v1/formulas/?format=json'
				);
				setFormulas(data);
				console.log(data);
			} catch (error) {
				console.error(error);
			}
		};

		getFormulas();
	}, []);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Все функции</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Все функции</DialogTitle>
					<DialogDescription>
						Просмотр всех операций и добавление кастомных
					</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col gap-4 py-4'>
					{formulas.map((formula) => (
						<div key={formula.id} className='flex items-center gap-4'>
							<Badge>{formula.name}</Badge>
							<Input defaultValue={formula.body} />
						</div>
					))}
				</div>

				<DialogFooter>
					<Button>Сохранить изменения</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default FormulasList;
