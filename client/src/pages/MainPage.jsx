import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import TableCard from '../components/shared/TableCard';

const MainPage = () => {
	const [tables, setTables] = useState([]);

	useEffect(() => {
		const getAllTables = async () => {
			try {
				const response = await axios.get(
					'http://localhost:8000/ruxel/api/v1/tables/?format=json'
				);
				console.log(response.data);
				setTables(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		getAllTables();
	}, []);

	return (
		<Card>
			<CardHeader>
				<CardTitle>История таблиц</CardTitle>
				<CardDescription>
					Таблицы подгружаются с внешнего сервиса
				</CardDescription>
			</CardHeader>

			<Separator />

			<CardContent className='flex flex-col gap-4 p-4'>
				{tables.map((table) => (
					<Link to={`/tables/${table.id}`} key={table.id}>
						<TableCard
							name={table.name}
							//correct date in format DD.MM.YYYY HH:MM:SS
							createdAt={new Date(table.created_at).toLocaleString('ru-RU')}
							updatedAt={new Date(table.changed_at).toLocaleString('ru-RU')}
						/>
					</Link>
				))}
			</CardContent>
		</Card>
	);
};

export default MainPage;
