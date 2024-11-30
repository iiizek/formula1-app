import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';

import { Menu } from 'lucide-react';

const MainPage = () => {
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
				<Card className='flex justify-between items-center gap-4 p-2'>
					<h2 className='ml-4 text-xl'>Таблица 1</h2>

					<div className='flex justify-between items-center gap-4'>
						<span>Создана: 29.01.2005 12:00</span>

						<Separator className='h-10' orientation='vertical' />

						<Button
							variant='outline'
							className='border-primary hover:bg-primary w-10 h-10'
						>
							<Menu />
						</Button>
					</div>
				</Card>
			</CardContent>
		</Card>
	);
};

export default MainPage;
