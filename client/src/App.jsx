import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import TablePage from './pages/TablePage';
import { Switch } from './components/ui/switch';
import { Card } from './components/ui/card';

import { FileSpreadsheetIcon } from 'lucide-react';
import { Moon } from 'lucide-react';

import 'ag-grid-enterprise';

function App() {
	const [isDarkTheme, setIsDarkTheme] = useState(() => {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			return storedTheme === 'dark';
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	useEffect(() => {
		if (isDarkTheme) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDarkTheme]);

	return (
		<div className='flex flex-col gap-4 p-8'>
			<Card className='flex justify-between items-center p-8'>
				<h1 className='flex items-center gap-4 font-bold text-3xl'>
					<FileSpreadsheetIcon size={32} className='text-primary' />
					Formula 1 | Редактор табличных данных
				</h1>

				<Card className='flex items-center gap-2 p-2'>
					<Switch
						checked={isDarkTheme}
						onClick={() => setIsDarkTheme(!isDarkTheme)}
					/>
					<Moon size={24} className='text-primary' />
				</Card>
			</Card>
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route
					path='/tables/:tableId'
					element={<TablePage isDarkTheme={isDarkTheme} />}
				/>
			</Routes>
		</div>
	);
}

export default App;
