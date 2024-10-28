<template>
  <div>
    <div class="hero-container">
      <div class="hero">
        <img src="https://picsum.photos/1200/600" alt="big" class="big-image" />
        <img
          src="https://picsum.photos/500/600"
          alt="big"
          class="small-image"
        />
        <div class="overlay">
          <h1 class="title">SN BEAUTY</h1>
          <div class="content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse et commodo ligula. Orci varius natoque penatibus et
              magnis dis parturient montes, nascetur ridiculus mus. Pellentesque
              euismod tempus lectus, et auctor enim tempus et.
            </p>
            <button>BOKA BEHANDLING</button>
          </div>
        </div>
      </div>
    </div>
    <div class="treatments-container">
      <h2 class="sub-title">BEHANDLINGAR</h2>
      <div class="treatments">
        <Carousel>
          <Slide v-for="(slide, index) in slides" :key="index">
            <div class="carousel__item">
              <img
                :src="slide.image"
                alt="Slide image"
                class="carousel__image"
              />
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.description }}</p>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
export default {
  data() {
    return {
      items: [], // This will store the products
      slides: [
        {
          title: "First Slide",
          image: "path/to/image1.jpg",
          description: "This is the description for the first slide.",
        },
        {
          title: "Second Slide",
          image: "path/to/image2.jpg",
          description: "This is the description for the second slide.",
        },
        {
          title: "Third Slide",
          image: "path/to/image3.jpg",
          description: "This is the description for the third slide.",
        },
        // Add more slides as needed
      ],
    };
  },
  created() {},
  methods: {},
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  name: "HomeView",
};
</script>

<style>
.carousel__item {
  text-align: center;
  padding: 10px;
  height: 100vh;
  width: 100%;
}

.carousel__image {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.hero-container {
  padding-bottom: 140px;
}
.treatments-container {
  padding-top: 70px;
}
.hero-container,
.treatments {
  max-width: 1280px;
  margin: 0 auto;
}
.treatments-container {
  background-color: #f3f3f3;
  width: 100%;
  position: relative;
}

.hero {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.big-image {
  z-index: -2;
  position: absolute;
  right: 0;
  top: 0;
  width: 80%;
  height: 100%;
  object-fit: cover;
}
.small-image {
  z-index: -1;
  position: absolute;
  left: 1%;
  top: 50%;
  height: 80%;
  width: 25%;
  object-fit: cover;
  transform: translate(6%, -50%);
}

.overlay {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;
}
.sub-title {
  font-size: 8em;
  font-family: "Playfair Display", serif !important;
  color: #202020;
  opacity: 50%;
  letter-spacing: 4%;
  line-height: 180.78px;
  font-weight: 600;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -285%); /* Centers and offsets slightly up */
}
.title {
  font-size: 8em;
  font-family: "Playfair Display", serif !important;
  border-bottom: 2px solid white;
  color: white;
  letter-spacing: 4%;
  line-height: 180.78px;
  font-weight: 600;
}

.content {
  display: flex;
  flex-direction: column;
  color: black;
  background: rgba(255, 255, 255, 0.5);
  padding: 20px;
  width: 35%;
  align-self: right;
  font-size: 16px;
  line-height: 22.5px;
  margin-bottom: 4.5%;
  margin-left: 19%;
}

.content p {
  margin-bottom: 20px;
  font-size: 0.8em;
  line-height: 1.5;
  color: #333;
}

button {
  font-family: "Playfair Display", serif !important;
  padding: 10px 20px;
  font-size: 1em;
  color: #333;
  background-color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  align-self: flex-end;
}

button:hover {
  background-color: #333;
  color: white;
}
</style>
