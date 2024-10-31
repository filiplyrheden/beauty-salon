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
              <div class="carousel__images">
                <img
                  :src="slide.image"
                  alt="Slide image"
                  class="carousel__image carousel__image__back"
                />
                <img
                  :src="slide.image"
                  alt="Slide image"
                  class="carousel__image carousel__image__front"
                />
              </div>
              <div class="carousel__content">
                <h3 class="carousel__content__title">{{ slide.title }}</h3>
                <p class="carousel__content__description">
                  {{ slide.description }}
                </p>
                <button class="carousel__content__button">TILL BOKNING</button>
              </div>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
    </div>
    <div class="about-me-container">
      <div class="about-me">
        <div class="about-me-image">
          <img src="../assets/Shahad2.png" alt="" />
        </div>
        <div class="about-me-content">
          <h2>SHAHAD NASIR</h2>
          <div class="about-me-content-text">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse et commodo ligula. Orci varius natoque penatibus et
              magnis dis parturient montes, nascetur ridiculus mus. Pellentesque
              euismod tempus lectus, et auctor enim tempus et.
            </p>
            <button>MER OM MIG</button>
          </div>
        </div>
      </div>
    </div>
    <div class="products-container">
      <div class="products">
        <div class="products-header">
          <h2 class="products-header-title">BESTÄLL HEM</h2>
          <div class="line"></div>
          <router-link to="/shop">
            <button class="products-header-button">Visa alla</button>
          </router-link>
        </div>
        <ProductCarousel></ProductCarousel>
      </div>
    </div>
    <div class="courses-container">
      <div class="courses">
        <h2 class="courses-title">Kurser & Utbildningar</h2>
        <div class="courses-content">
          <img class="courses-image" src="../assets/noImage.png" alt="" />
          <div class="courses-text-content">
            <p class="courses-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse et commodo ligula. Orci varius natoque penatibus et
              magnis dis parturient montes, nascetur ridiculus mus. Pellentesque
              euismod tempus lectus, et auctor enim tempus et.
            </p>
            <button class="courses-button">LÄS MER</button>
          </div>
        </div>
      </div>
    </div>
    <div class="events-container">
      <div class="events">
        <h2 class="events-title">Boka Event</h2>
        <p class="events-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          et commodo ligula. Orci varius natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus. Pellentesque euismod tempus
          lectus, et auctor enim tempus et.
        </p>
        <Button class="events-button">BOKA</Button>
      </div>
    </div>
    <div class="social-media-container">
      <div class="social-media"><h2>SOCIAL MEDIER</h2></div>
    </div>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import noImage from "@/assets/noImage.png";
import ProductCarousel from "@/components/ProductCarousel.vue";

export default {
  data() {
    return {
      items: [],
      slides: [
        {
          title: "Brudmakeup",
          image: noImage,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse et commodo ligula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque euismod tempus lectus, et auctor enim tempus et.",
        },
        {
          title: "Ansiktsbehandlingar",
          image: noImage,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse et commodo ligula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque euismod tempus lectus, et auctor enim tempus et..",
        },
        {
          title: "Massage",
          image: noImage,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse et commodo ligula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque euismod tempus lectus, et auctor enim tempus et.",
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
    ProductCarousel,
  },
  name: "HomeView",
};
</script>

<style scoped>
.carousel__item {
  text-align: center;
  padding: 10px;
  height: 70vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel__images,
.carousel__content {
  display: flex;
  flex-direction: column;
}
.carousel__images {
  height: 100%;
  margin-left: 100px;
  margin-right: 10px;
  width: 60%;
  position: relative;
}
.carousel__content {
  margin-right: 100px;
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}
.carousel__content__title {
  font-family: "Playfair Display", serif !important;

  font-size: 33.18px;
  font-weight: 600;
  line-height: 36.5px;
  letter-spacing: 0.02em;
  text-align: center;
}
.carousel__content__description {
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  text-align: center;
}
.carousel__content__button {
  font-family: "Playfair Display", serif !important;
  font-size: 16px;
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.04em;
  text-align: left;
  align-self: center;
}
.carousel__pagination-button {
  background-color: unset;
}
.carousel__pagination-button::after {
  width: 9px;
  height: 9px;
  border-radius: 6px;
  background-color: unset;
  border: 1px solid black;
}
.carousel__pagination-item {
  display: flex;
}
.carousel__prev,
.carousel__next,
.carousel__icon {
  width: 75px;
  height: 75px;
}
.carousel__pagination {
  gap: 6px;
}
.carousel__pagination-button--active::after {
  background-color: var(--vc-pgn-active-color);
  width: 12px;
  height: 12px;
  border-radius: 6px;
}
.carousel__image {
  width: 60%;
  height: auto;
  height: 50%;
  object-fit: cover;
}
.carousel__image__front,
.carousel__image__back {
  position: absolute;
}
.carousel__image__front {
  position: absolute;
  bottom: 100px;
  right: 0;
}
.carousel__image__back {
  position: absolute;
  top: 100px;
  left: 0;
}
.hero-container {
  padding-bottom: 140px;
}
.treatments-container {
  padding: 70px 0px;
}
.hero-container,
.treatments {
  max-width: 1280px;
  margin: 0 auto;
}
.about-me {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  height: 100%;
  padding-bottom: 80px;
}
.treatments-container {
  background-color: #f3f3f3;
  width: 100%;
  position: relative;
}
.products-container {
  height: 90vh;
  width: 100%;
}
.products-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 80px;
  padding-bottom: 40px;
}
.products-header-title {
  font-family: "Playfair Display", serif !important;
  font-size: 33.18px;
  font-weight: 600;
  line-height: 36.5px;
  letter-spacing: 0.02em;
  text-align: left;
  white-space: nowrap;
  color: rgba(32, 32, 32, 0.5);
}
.products-header .line {
  width: fill-available;
  height: 1px;
  background-color: rgba(32, 32, 32, 0.5);
}
.products-header-button {
  white-space: nowrap;
  width: 79px;
  padding: 8px 12px;
  background: #202020;
  color: #f3f3f3;
  font-family: "Playfair Display", serif !important;
  font-size: 14px;
  font-weight: 600;
  line-height: 15.4px;
  letter-spacing: 0.02em;
  text-align: left;
}

.events-container {
  width: 100%;
  height: 50vh;
  background-color: #dddddd;
}
.events {
  max-width: 362px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.events-title {
  font-family: "Playfair Display", serif !important;
  font-size: 33.18px;
  font-weight: 600;
  line-height: 36.5px;
  letter-spacing: 0.02em;
  text-align: center;
  color: rgba(32, 32, 32, 0.5);
}
.events-content {
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  text-align: center;
}
.events-button {
  padding: 16px 24px;
  gap: 0px;
  opacity: 0px;
  font-size: 16px;
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.04em;
  align-self: center;
}
.about-me-container {
  width: 100%;
  height: 90vh;
  background-color: #cacaca;
}

.about-me-image {
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-100%, -50%);
  z-index: 1;
}
.about-me-image img {
  height: 100%;
}
.about-me-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 800px;
}
.about-me-content h2 {
  font-family: "Playfair Display", serif !important;
  font-size: 99.08px;
  font-weight: 600;
  line-height: 108.99px;
  letter-spacing: 0.04em;
  text-align: left;
  color: #f3f3f3;
  z-index: 1;
  text-align: center;
}
.about-me-content-text {
  width: 50%;
  padding-top: 32px;
  margin-top: 16px;
  border-top: 1px solid rgba(104, 98, 98, 0.5);

  align-self: flex-end;
  margin-right: 30px;
  display: flex;
  gap: 16px;
  flex-direction: column;
}

.about-me-content-text p {
  font-size: 16px;
  font-weight: 400;
  line-height: 22.4px;
  text-align: left;
}
.about-me-content-text button {
  align-self: flex-start;
}
.courses-container {
  width: 100%;
  height: 90vh;
}
.courses {
  max-width: 1280px;

  margin: 0 auto;
  padding: 0px 40px 0px 40px;
  height: 100%;
  margin-top: 80px;
}
.courses-title {
  font-family: "Playfair Display", serif !important;
  font-size: 47.78px;
  font-weight: 600;
  line-height: 52.56px;
  letter-spacing: 0.04em;
  text-align: right;
  color: rgba(32, 32, 32, 0.5);
  padding-bottom: 32px;
}
.courses-content {
  display: flex;
  gap: 16px;
}
.courses-image {
  width: 50%;
  object-fit: cover;
}
.courses-text-content {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
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
  top: -88px;
  left: 50%;
  transform: translate(-50%, -8px);
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
