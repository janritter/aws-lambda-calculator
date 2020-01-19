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
		freeTier: 'false',
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

	onRadioChange = (e) => {
		this.setState({ freeTier: e.target.value });
	}

	runtimeAndMemoryForCostAndCalls = () => {
		if (this.state.freeTier === 'true') {
			return (
				<div>
					<hr />
					<h3 class="title is-3">Runtime and memory for same execution cost</h3>
					<article class="message is-warning">
						<div class="message-header">
							<p>Comparison with free tier not possible</p>
						</div>
						<div class="message-body">
							<p>Activated free tier falsifies the results of runtime and memory for same execustion cost.</p>
							<p>To get the result table, please deactivate free tier.</p>
						</div>
					</article>
				</div>
			);
		}

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
		// Free tier
		const freeGBs = 400000;
		const freeRequests = 1000000;

		if (this.state.calls && this.state.memory && this.state.runtime && this.state.freeTier) {

			// Request cost
			let requestsCoveredByFreeTier = 0;
			let requestsNotCoveredByFreeTier = 0;

			if (this.state.freeTier === 'true') {
				if (this.state.calls <= freeRequests) {
					requestsCoveredByFreeTier = this.state.calls;
				}
				else {
					requestsCoveredByFreeTier = freeRequests;
					requestsNotCoveredByFreeTier = this.state.calls - freeRequests;
				}
			}
			else {
				requestsNotCoveredByFreeTier = this.state.calls;
			}

			const requestCost = (this.pricePerMillionCalls / 1000000) * requestsNotCoveredByFreeTier;

			// Execution cost
			let executionCoveredByFreeTier = 0;
			let executionNotCoveredByFreeTier = 0;

			// 1 unit = 100ms
			let lambdaRuntime100msUnits = Math.round(this.state.runtime / 100);

			// Minimum 100ms
			if (lambdaRuntime100msUnits === 0) {
				lambdaRuntime100msUnits = 1;
			}

			const runtimeInSeconds = lambdaRuntime100msUnits / 10;
			const gigabyteSeconds = (runtimeInSeconds / (1024 / this.state.memory)) * this.state.calls;

			if (this.state.freeTier === 'true') {
				if (gigabyteSeconds <= freeGBs) {
					executionCoveredByFreeTier = gigabyteSeconds;
				}
				else {
					executionCoveredByFreeTier = freeGBs;
					executionNotCoveredByFreeTier = gigabyteSeconds - freeGBs;
				}
			}
			else {
				executionNotCoveredByFreeTier = gigabyteSeconds;
			}

			const executionCost = this.pricePerGBs * executionNotCoveredByFreeTier;
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
							{requestsCoveredByFreeTier !== 0 ?
								<p>
									<b>Requests covered by free tier: </b>{requestsCoveredByFreeTier}
								</p>
								:
								''
							}
							<p>
								<b>Billed requests: </b>{requestsNotCoveredByFreeTier}
							</p>
							<p>
								<b>Request cost: </b>{requestCost}$
							</p>
							<br />
							{executionCoveredByFreeTier !== 0 ?
								<p>
									<b>Execution GB/s covered by free tier: </b>{executionCoveredByFreeTier}
								</p>
								:
								''
							}
							<p>
								<b>Billed execution GB/s: </b>{executionNotCoveredByFreeTier}
							</p>
							<p>
								<b>Execution cost: </b>{executionCost}$
							</p>
							<br />
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
					<label class="label">Lambda runtime per execution in ms</label>
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
				<label class="label">Inlcude free tier? 1M free requests per month and 400,000 GB-seconds of compute time per month</label>
				<div class="control">
					<label class="radio">
						<input
							onChange={this.onRadioChange}
							type="radio" value="true" checked={this.state.freeTier === 'true'}
						/>
						Yes
					</label>
					<label class="radio">
						<input
							onChange={this.onRadioChange}
							type="radio" value="false" checked={this.state.freeTier === 'false'}
						/>
						No
					</label>
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
