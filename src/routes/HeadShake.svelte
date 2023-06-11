<script lang="ts">
	import dad_image from '$lib/images/dad.png';
	let shake = false;
	function startShake() {
		shake = true;
		setTimeout(() => {
			shake = false;
		}, 1000);
	}
</script>

<button
	class="h-16 w-16 rounded-full"
	class:shake
	on:click={startShake}
	on:mouseover={startShake}
	on:focus={startShake}
>
	<img src={dad_image} class="dad-image" alt="Dad" />
</button>


<style>
	@keyframes shake {
		0% {
			transform: rotate(0deg);
		}
		20% {
			transform: rotate(-10deg);
		}
		40% {
			transform: rotate(10deg);
		}
		60% {
			transform: rotate(-10deg);
		}
		80% {
			transform: rotate(10deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}

	.shake {
		animation: shake 0.5s ease-in-out;
	}
</style>
