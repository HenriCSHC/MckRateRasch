<script>
	import { onMount, onDestroy } from 'svelte'; 

	let socket = undefined;

	let host = undefined;
	let wsUri = "";

	function InputChange(_evt) {
		console.log(_evt.target.value);
	}

	function RecvMsg(_evt) {
		console.log(`New message ${_evt.data}`);

		socket.send("Hello Backend!");
	}

	onMount(() => {
		let _loc = window.location;
		host = _loc.host;
		wsUri = `ws://${host}`;
		socket = new WebSocket(wsUri);
		socket.onmessage = RecvMsg;
	});
</script>

<main>
	<h1>MckRateRasch</h1>
	<input on:change={InputChange}/>
	<button>Erstelle Raum</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>