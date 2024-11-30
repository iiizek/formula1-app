import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Menu } from 'lucide-react';
import { Separator } from '../ui/separator';

const TableCard = ({ name, createdAt, updatedAt }) => {
	return (
		<Card className='flex justify-between items-center gap-4 p-2'>
			<h2 className='ml-4 text-xl'>Таблица 1</h2>

			<div className='flex justify-between items-center gap-4'>
				<span>Создана: 29.01.2005 12:00</span>
				<span>Изменена: 29.01.2005 12:00</span>

				<Separator className='h-10' orientation='vertical' />

				<Button
					variant='outline'
					className='border-primary hover:bg-primary w-10 h-10'
				>
					<Menu />
				</Button>
			</div>
		</Card>
	);
};

export default TableCard;
