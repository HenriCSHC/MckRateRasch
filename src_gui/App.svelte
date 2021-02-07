<script>
	import { onMount, onDestroy } from 'svelte'; 

	let socket = undefined;

	let host = undefined;
	let wsUri = "";

	let newRoomName = "";
	let roomReady = false;
	let roomData = undefined;

	function CreateRoom(_evt) {
		let _msg = {
			section: "room",
			type: "enter",
			data: newRoomName
		};
		socket.send(JSON.stringify(_msg));
	}

	function RecvMsg(_evt) {
		let _msg = undefined;
		try {
			_msg = JSON.parse(_evt.data);
		} catch (_err) {
			console.log("MSG Error: " + _err);
			return;
		}
		console.log(`New message ${_evt.data}`);

		//socket.send("Hello Backend!");

		switch (_msg.section) {
			case "room":
				if (_msg.type === "data") {
					roomData = _msg.data;
					roomReady = true;
				}
			break;
		}
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
	{#if roomReady}
		<span>Raum:</span>
		<span>{roomData.name}</span>
		<p>Spieler:</p>
	{:else}
		<input on:change={_e => {
			newRoomName = _e.target.value;
		}}/>
		<button on:click={CreateRoom}>Erstelle Raum</button>
	{/if}
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