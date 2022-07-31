import {PieChart, Pie, Sector, Cell, ResponsiveContainer} from 'recharts';
import {useState, useEffect} from 'react';
import {isMobile} from '../../utils';

const Allocation = ({equity, debt, equityPercentage, debtPercentage}) => {
	// console.log(equity, debt)
	const [data, setData] = useState([]);

	useEffect(() => {
		setData([{
			name: 'Equity', amount: `Equity: ${equity}`, percent: equityPercentage
		}, {
			name: 'Debt', amount: `Debt: ${debt}`, percent: debtPercentage
		}]);
	}, [equity, debt, equityPercentage, debtPercentage]);

	const COLORS = ['#00C49F', '#FFBB28'];

	const RADIAN = Math.PI / 180;
	// const renderCustomizedLabel = ({cx, cy, x, y , midAngle, innerRadius, outerRadius, name, value, payload, ...data}) => {
	// 	console.log({ data })
	// 	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	// 	// const x = cx + radius * Math.cos(-midAngle * RADIAN);
	// 	// const y = cy + radius * Math.sin(-midAngle * RADIAN);
	// 	return (<text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
	// 		{ payload.amount }
	// 	</text>);
	// };

	return <ResponsiveContainer width="100%" height="100%">
		<PieChart width={isMobile() ? 200 : 400} height={isMobile() ? 150 : 250}>
			<Pie
					data={data}
					// cx="50%"
					// cy="50%"
					// labelLine={false}
					// label={renderCustomizedLabel}
					// outerRadius={125}
					// fill="#8884d8"
					dataKey="percent"
					// label
			>
				{data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
			</Pie>
		</PieChart>
	</ResponsiveContainer>;
};

export default Allocation;
