import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Menu } from 'lucide-react';
import { Separator } from '../ui/separator';

const TableCard = ({ name, createdAt, updatedAt }) => {
	return (
		<Card className='flex justify-between items-center gap-4 hover:bg-muted p-2 transition-all'>
			<h2 className='ml-4 text-xl'>{name}</h2>

			<div className='flex justify-between items-center gap-4'>
				<span>Создана: {createdAt}</span>
				<span>Изменена: {updatedAt}</span>

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
