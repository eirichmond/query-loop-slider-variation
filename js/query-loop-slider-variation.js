document.addEventListener("DOMContentLoaded", () => {
	const carousels = document.querySelectorAll(".query-loop-carousel");

	carousels.forEach(carousel => {
		const prevButton = carousel.querySelector(".carousel-prev");
		const nextButton = carousel.querySelector(".carousel-next");
		const postTemplate = carousel.querySelector(".carousel-post-template");

		let currentIndex = 0;
		const itemsToShow = parseInt(carousel.dataset.itemsToShow || 3, 10);
		const totalItems = postTemplate.children.length;

		const updateCarousel = () => {
			const offset = -(currentIndex * 100) / itemsToShow;
			postTemplate.style.transform = `translateX(${offset}%)`;
		};

		prevButton.addEventListener("click", () => {
			currentIndex = (currentIndex - 1 + totalItems) % totalItems;
			updateCarousel();
		});

		nextButton.addEventListener("click", () => {
			currentIndex = (currentIndex + 1) % totalItems;
			updateCarousel();
		});
	});
});
