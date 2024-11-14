<template>
  <div class="reviews-container">
    <div class="reviews">
      <!-- Conditionally render static blocks or carousel based on screen size -->
      <Carousel v-if="isMobile" :items-to-show="1" :items-to-scroll="1">
        <Slide v-for="review in displayedReviews" :key="review.review_id">
          <div class="review-item">
            <div class="review-text">
              <img src="../assets/quotation.svg" alt="" class="top-quote" />
              {{ getTruncatedText(review.review_text) }}
              <img src="../assets/quotation.svg" alt="" class="bottom-quote" />
            </div>

            <div class="stars">
              <!-- Render stars based on review rating -->
              <span v-for="n in getStars(review.rating)" :key="n" class="star"
                >★</span
              >
            </div>
          </div>
        </Slide>
        <template #addons>
          <Navigation />
        </template>
      </Carousel>

      <!-- Render static blocks for desktop view -->
      <div v-else class="static-reviews">
        <div
          v-for="(review, index) in displayedReviews"
          :key="review.review_id"
          :class="`review-item review-item${index + 1}`"
        >
          <div class="review-text">
            <img src="../assets/quotation.svg" alt="" class="top-quote" />
            {{ getTruncatedText(review.review_text) }}
            <img src="../assets/quotation.svg" alt="" class="bottom-quote" />
          </div>
          <div class="stars">
            <!-- Render stars based on review rating -->
            <span v-for="n in getStars(review.rating)" :key="n" class="star"
              >★</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide, Navigation } from "vue3-carousel";
import axiosInstance from "@/services/axiosConfig";

export default {
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  data() {
    return {
      reviews: [],
      windowWidth: window.innerWidth, // Track initial window width
    };
  },
  mounted() {
    this.fetchReviews();
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    async fetchReviews() {
      try {
        const response = await axiosInstance.get(`/page-reviews`);
        this.reviews = response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    getStars(rating) {
      return Array.from({ length: rating }, (_, i) => i + 1);
    },
    getTruncatedText(text) {
      return text.length > 200 ? text.slice(0, 200) + "..." : text;
    },
  },
  computed: {
    isMobile() {
      return this.windowWidth < 768;
    },
    // Display only the first 3 reviews
    displayedReviews() {
      return this.reviews.slice(0, 3);
    },
  },
};
</script>

<style scoped>
.reviews-container {
  width: 100%;
}
.reviews {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px;
}
.static-reviews {
  display: flex;
  gap: 24px;
}
.review-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
  align-items: center;
  padding: 32px 64px;
  background-color: rgba(32, 32, 32, 1);
  width: 33%;
  height: 240px;
  color: white;
  /* Add more styling as needed */
}
.review-text {
  font-size: 18px;
  text-align: center;
  position: relative;
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  width: 100%;
}

.bottom-quote {
  position: absolute;
  bottom: 0;
  right: -40px;
  opacity: 0.5;
}
.top-quote {
  position: absolute;
  top: 0;
  left: -40px;
  opacity: 0.5;
}

/* Responsive styling */
@media (max-width: 1200px) and (min-width: 768px) {
  .review-item1 {
    display: none;
  }
  .review-item {
    height: 230px;
    width: 48%;
  }
  .reviews {
    padding: 64px;
  }
}

@media (max-width: 768px) {
  .static-reviews {
    display: none; /* hide static reviews on smaller screens */
  }
  .review-item {
    height: 200px;
    width: 100%; /* full width for single-column display */
    margin: 0 6px;
  }
  .reviews {
    padding: 32px;
  }
}
</style>
