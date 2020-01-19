import { h, Component } from 'preact';
import style from './style';

class Calculator extends Component {
	minMemory = 128;
	maxMemory = 3008;

	// Region Frankfurt
	pricePerGBs = 0.000016667;
	pricePerMillionCalls = 0.2;

	state = {
		calls: null,
		runtime: null,
		memory: this.minMemory,
		executionCost: 0
	};

	onCallsInput = e => {
		this.setState({ calls: Number(e.target.value) });
	}

	onRuntimeInput = e => {
		this.setState({ runtime: Number(e.target.value) });
	}

	onMemoryInput = e => {
		this.setState({ memory: Number(e.target.value) });
	}

	runtimeAndMemoryForCostAndCalls = () => {
		if (this.state.executionCost) {
			const runtimesForMemory = [];

			for (let memory = this.minMemory; memory <= this.maxMemory; memory += 64) {
				const pricePer100ms = ((this.pricePerGBs / 1024) * memory) / 10;

				let runtime = (this.state.executionCost / (pricePer100ms * this.state.calls)) * 100;

				// Can't be less than 100ms
				if (runtime >= 100) {
					runtimesForMemory.push(
						<tr>
							<th>{memory}</th>
							<td>{Math.floor(runtime)}</td>
						</tr>
					);
				}
			}

			return (
				<div>
					<hr />
					<h3 class="title is-3">Runtime and memory for same execution cost</h3>
					<table class="table">
						<thead>
							<tr>
								<th>Memory in MB</th>
								<th>Runtime in ms</th>
							</tr>
						</thead>
						<tbody>
							{runtimesForMemory}
						</tbody>
					</table>
				</div>
			);
		}
	}

	renderResult = () => {
		if (this.state.calls && this.state.memory && this.state.runtime) {

			const requestCost = (this.pricePerMillionCalls / 1000000) * this.state.calls;

			const pricePer100ms = ((this.pricePerGBs / 1024) * this.state.memory) / 10;

			// 1 unit = 100ms
			let lambdaRuntime100msUnits = Math.round(this.state.runtime / 100);

			// Minimum 100ms
			if (lambdaRuntime100msUnits === 0) {
				lambdaRuntime100msUnits = 1;
			}

			const executionCost = pricePer100ms * lambdaRuntime100msUnits * this.state.calls;
			this.state.executionCost = executionCost;

			const lambdaRuntimeDifferenceFromBilled = this.state.runtime - lambdaRuntime100msUnits * 100;

			return (
				<div>
					{lambdaRuntimeDifferenceFromBilled !== 0 ?
						<article class="message is-info">
							<div class="message-header">
								<p>Runtime billing info</p>
							</div>
							<div class="message-body">
								<p>AWS bills Lambda per 100ms. The runtime is rounded up to the nearest 100ms.</p>
								<p>
									<b>Runtime used for calculation: </b>{lambdaRuntime100msUnits * 100}ms
								</p>
							</div>
						</article>
						:
						''
					}
					<article class="message">
						<div class="message-header">
							<p>Your cost</p>
						</div>
						<div class="message-body">
							<p>
								<b>Request cost: </b>{requestCost}$
							</p>
							<p>
								<b>Execution cost: </b>{executionCost}$
							</p>
							<p>
								<b>Total cost: </b>{requestCost + executionCost}$
							</p>
						</div>
					</article>
				</div>
			);
		}
	};

	render() {
		const dropdownOptions = [];

		for (let memory = this.minMemory; memory <= this.maxMemory; memory += 64) {
			dropdownOptions.push(<option value={memory}>{memory}</option>);
		}

		return (
			<div class={style.home}>
				<h1 class="title is-1">AWS Lambda calculator</h1>
				<hr />
				<div class="field">
					<label class="label">Lambda calls</label>
					<div class="control">
						<input
							onInput={this.onCallsInput}
							name="lambdaCalls" class="input" type="number" placeholder="1" min="1" required
						/>
					</div>
				</div>
				<div class="field">
					<label class="label">Lambda per execution runtime in ms</label>
					<div class="control">
						<input
							onInput={this.onRuntimeInput}
							name="lambdaRuntime" class="input" type="number" placeholder="600" min="1" required
						/>
					</div>
				</div>
				<label class="label">Configured memory in MB</label>
				<div class="select">
					<select value={this.state.memory} onInput={this.onMemoryInput}>
						{dropdownOptions}
					</select>
				</div>
				<br />
				<br />
				{this.renderResult()}
				{this.runtimeAndMemoryForCostAndCalls()}
			</div>
		);
	}
}

export default Calculator;
