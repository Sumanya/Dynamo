import Input from '../../../common_components/input/Input';

const AmountAvailable = ({ amount, setAmount }) => {
	return <>
		<h5>Investment Amount</h5>
		<Input placeholder="Amount to invest" value={amount} onInput={e => setAmount(e.target.value)}/>
	</>
}
export default AmountAvailable;
