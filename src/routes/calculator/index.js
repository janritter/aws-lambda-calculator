import { h } from 'preact';
import style from './style';

const Calculator = () => {
	const minMemory = 128;
	const maxMemory = 3008;

	let dropdownOptions = [];

	for (let memory = minMemory; memory <= maxMemory; memory += 64) {
		dropdownOptions.push(<option>{memory}</option>);
	}

	return (
		<div class={style.home}>
			<h1 class="title is-1">AWS Lambda calculator</h1>
			<hr />
			<form>
				<div class="field">
					<label class="label">Lambda calls</label>
					<div class="control">
						<input name="lambdaCalls" class="input" type="number" placeholder="1" required />
					</div>
				</div>
				<div class="field">
					<label class="label">Lambda per execution runtime in ms</label>
					<div class="control">
						<input name="lambdaRuntime" class="input" type="number" placeholder="600" required />
					</div>
				</div>
				<label class="label">Configured memory in MB</label>
				<div class="select">
					<select>
						{dropdownOptions}
					</select>
				</div>
				<br />
				<br />
				<input type="submit" value="Calculate" class="button is-link" />
			</form>
		</div>
	);
};

export default Calculator;
