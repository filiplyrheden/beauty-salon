<template>
  <div>
    <div class="hero-container">
      <div class="hero">
        <img src="../assets/landingBig.png" alt="big image" class="big-image" />
        <div class="big-image-overlay"></div>
        <img
          src="../assets/landingSmall.png"
          alt="small image"
          class="small-image"
        />
        <div class="overlay">
          <h1 class="title">SN BEAUTY</h1>
          <div class="content">
            <h3 class="content-title">Där du hittar avslappning i vardagen.</h3>
            <p class="content-text">
              Unna dig massage, ansiktsbehandlingar och sminkning i en lugn och
              omsorgsfull miljö. Vi tar hand om dig!
            </p>
            <router-link to="/behandlingar">
              <button>BOKA BEHANDLING</button>
            </router-link>
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
                  :src="slide.image1"
                  alt="Slide image"
                  class="carousel__image carousel__image__back"
                />
                <img
                  :src="slide.image2"
                  alt="Slide image"
                  class="carousel__image carousel__image__front"
                />
              </div>
              <div class="carousel__content">
                <h3 class="carousel__content__title">{{ slide.title }}</h3>
                <p class="carousel__content__description">
                  {{ slide.description }}
                </p>
                <router-link to="/behandlingar">
                  <button class="carousel__content__button">
                    TILL BOKNING
                  </button>
                </router-link>
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
              Shahad Nazir är en passionerad brudsminkös och auktoriserad
              hudterapeut med gedigen utbildning inom skönhet och hudvård.Genom
              skräddarsydda behandlingar och rådgivning hjälper hon sina kunder
              att känna sig både vackra och välmående.
            </p>
            <router-link to="/om-mig"> <button>MER OM MIG</button></router-link>
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
        <ProductGrid></ProductGrid>
      </div>
    </div>
    <div class="courses-container">
      <div class="courses">
        <h2 class="courses-title">Kurser & Utbildningar</h2>
        <div class="courses-content">
          <img class="courses-image" src="../assets/courses.png" alt="" />
          <div class="courses-text-content">
            <p class="courses-text">
              Vill du utveckla dina sminkkunskaper eller kanske ta dina
              färdigheter till nästa nivå? Shahad erbjuder en rad kurser och
              utbildningar inom makeup och skönhet – från grundläggande
              sminkkurser till avancerade tekniker och workshops för både
              nybörjare och erfarna entusiaster. Varje kurs är noggrant utformad
              för att ge dig verktygen och kunskapen du behöver för att skapa
              imponerande looks med självförtroende. Anmäl dig nu via
              Bokadirekt, eller kontakta oss direkt för en skräddarsydd kurs och
              fördjupa dig i en värld av färg, teknik och kreativitet!
            </p>
            <router-link to="/kurser">
              <button class="courses-button">TILL BOKNING</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="events-container">
      <div class="events">
        <h2 class="events-title">Boka Event</h2>
        <p class="events-content">
          Oavsett om det är möhippa, födelsedag eller sminkworkshop erbjuder
          Shahad skräddarsydda skönhetsupplevelser som gör ditt event
          minnesvärt. Perfekt för alla gruppstorlekar – varje session anpassas
          med sminktips, tutorials och en härlig atmosfär. Skapa oförglömliga
          minnen och stråla med hjälp av ett proffs som balanserar stil,
          kreativitet och glädje!
        </p>

        <router-link to="/events">
          <button class="events-button">TILL BOKNING</button>
        </router-link>
      </div>
    </div>
    <HomepageReviews></HomepageReviews>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import ProductCarousel from "@/components/ProductCarousel.vue";
import ProductGrid from "@/components/ProductGrid.vue";
import HomepageReviews from "@/components/HomepageReviews.vue";
import brudmakeup1 from "../assets/brudsminkning1.jpg";
import brudmakeup2 from "../assets/brudsminkning2.jpg";
import ansiktsbehandling1 from "../assets/ansiktsbehandling1.jpg";
import ansiktsbehandling2 from "../assets/ansiktsbehandling2.jpg";
import massage1 from "../assets/massage1.jpg";
import massage2 from "../assets/massage2.jpg";

export default {
  data() {
    return {
      items: [],
      slides: [
        {
          title: "Brudmakeup",
          image1: brudmakeup2,
          image2: brudmakeup1,
          description:
            "På din stora dag förtjänar du att stråla. Vår brudmakeup är designad för att framhäva din naturliga skönhet och hålla hela dagen och natten. Vi skapar en look som harmonierar med din stil, klänning och tema – från klassiskt elegant till modernt och fräscht.",
        },
        {
          title: "Ansiktsbehandlingar",
          image1: ansiktsbehandling2,
          image2: ansiktsbehandling1,
          description:
            "Ge din hud nytt liv med våra ansiktsbehandlingar, skräddarsydda efter din hudtyp och behov. Perfekt för att rengöra på djupet, återfukta och få en naturlig lyster.",
        },
        {
          title: "Massage",
          image1: massage1,
          image2: massage2,
          description:
            "Koppla av med våra avslappnande massager, designade för att lösa upp spänningar och främja cirkulation. Vi anpassar behandlingen för att du ska känna dig balanserad och återhämtad.",
        },
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
    ProductGrid,
    HomepageReviews,
  },
  name: "HomeView",
};
</script>

<style scoped>
.product-grid {
  display: none;
  padding: 16px;
}
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
.carousel__image {
  width: 60%;
  height: auto;
  height: 70%;
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
  margin-bottom: 140px;
}
.treatments-container {
  padding: 70px 0px;
}
.hero-container {
  width: 100%;
  height: calc(100vh - 122px);
}
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
  background-color: var(--light-beige-background);
  width: 100%;
  position: relative;
}
.products-container {
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
  padding-right: 26px;
  padding-left: 26px;
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
  background-color: var(--light-beige-background);
}
.events {
  padding-top: 32px;
  padding-bottom: 32px;
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
  background-color: var(--dark-beige-background);
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
}
.courses {
  max-width: 940px;
  margin: 80px auto;
  padding: 40px;
  height: 100%;
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
  gap: 32px;
}
.courses-image {
  width: 50%;
  object-fit: cover;
  height: 400px;
}
.courses-button {
  font-family: "Playfair Display", serif !important;
  font-size: 16px;
  font-weight: 600;
  line-height: 17.6px;
  letter-spacing: 0.04em;
  text-align: left;
  align-self: flex-start;
  padding: 16px 24px;
  background-color: #202020;
  color: #f3f3f3;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}
.courses-text-content {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.big-image-overlay {
  z-index: -2;
  position: absolute;
  right: 0;
  top: 0;
  width: 80%;
  height: 100%;
  object-fit: cover;
  background-color: rgba(0, 0, 0, 0.6);
}
.small-image {
  z-index: 0;
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
  gap: 12px;
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
  color: white;
  padding: 20px;
  width: 35%;
  align-self: right;
  font-size: 16px;
  line-height: 22.5px;
  margin-bottom: 4.5%;
  margin-left: 9%;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.content-title {
  font-size: 19.2px;
  font-weight: 500;
  line-height: 26.88px;
  letter-spacing: 0.02em;
  text-align: center;
}

.content p {
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  text-align: center;
}

button {
  font-family: "Playfair Display", serif !important;
  font-size: 1em;
  color: #333;
  background-color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  padding: 16px 24px;
  border: 1px 0px 0px 0px;
  opacity: 0px;
}

button:hover {
  background-color: #333;
  color: white;
}

@media (max-width: 768px) {
  .product-grid {
    display: flex;
  }
  .products-container {
    height: unset;
  }
  .hero-container {
    margin-bottom: 80px;
  }
  .small-image {
    display: none;
  }
  .big-image {
    width: 100%;
  }
  .big-image-overlay {
    width: 100%;
  }
  .content {
    margin-left: 0%;
    width: 100%;
  }
  .title {
    font-size: 59.61px;
    font-weight: 600;
    line-height: 65.57px;
    letter-spacing: 0.04em;
    text-align: left;
  }

  .sub-title {
    font-size: 3.5em;
    font-weight: 600;
    line-height: 65.57px;
    letter-spacing: 0.04em;
    top: -30px;
  }
  .treatments-container {
    padding: 64px 0px;
  }
  .treatments .carousel__item {
    flex-direction: column;
    height: 80vh;
  }
  .treatments .carousel__images {
    margin: 0px;
    width: 100%;
    padding: 32px;
  }
  .treatments .carousel__image {
    width: 50%;
    height: 90%;
  }

  .treatments .carousel__image__front {
    bottom: -21px;
    right: 59px;
  }
  .treatments .carousel__image__back {
    top: -21px;
    left: 59px;
  }
  .treatments .carousel__content {
    width: 100%;
    padding: 32px;
    margin: 0px;
  }

  .carousel__icon {
    height: 44px !important;
    width: 44px !important;
  }
  .carousel__prev,
  .carousel__next {
    width: 44px !important;
    height: 44px !important;
  }
  .about-me-container {
    height: 100vh;
  }
  .about-me-content h2 {
    font-size: 3em;
    line-height: 42px;
    text-align: end;
    margin-right: 32px;
  }
  .about-me-content-text {
    margin-right: 20px;
  }
  .about-me-image {
    transform: translate(-88%, -50%);
  }

  .products-header {
    padding: 32px 26px;
  }
  .products-header-title {
    font-size: 1.3em;
    font-weight: 600;
    line-height: 36.5px;
    letter-spacing: 0.02em;
    text-align: left;
  }
  .products-header .line {
    display: none;
  }

  .courses {
    padding: 32px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .courses-title {
    font-size: 33.18px;
    font-weight: 600;
    line-height: 36.5px;
    letter-spacing: 0.02em;
    text-align: left;
  }
  .courses-content {
    flex-direction: column-reverse;
  }
  .courses-text-content,
  .courses-image {
    width: 100%;
  }

  .events-container {
    height: unset;
  }

  .events {
    padding: 32px;
  }
  .overlay {
    justify-content: center;
  }
}

@media (min-width: 768px) and (max-width: 1090px) {
  .sub-title {
    font-size: 5em;
    font-weight: 600;
    line-height: 65.57px;
    letter-spacing: 0.04em;
    top: -30px;
  }
}
@media (max-width: 580px) {
  .sub-title {
    font-size: 2.2em;
    font-weight: 600;
    line-height: 65.57px;
    letter-spacing: 0.04em;
    top: -30px;
  }
  .hero-container {
    margin-bottom: 40px;
  }
  .title {
    font-size: 3em;
  }
  .treatments .carousel__content > p {
    display: none;
  }
}
@media (max-width: 450px) {
  .treatments .carousel__item {
    height: 70vh;
  }

  .treatments .carousel__image {
    width: 70%;
    min-height: 200px;
    height: 58%;
  }
  .treatments .carousel__image__front {
    bottom: 50%;
    right: 32px;
    transform: translate(0, 80%);
  }
  .treatments .carousel__image__back {
    top: 50%;
    left: 32px;
    transform: translate(0, -80%);
  }
  .treatments-container {
    padding: 32px 0px;
  }
  .carousel__content__title {
    font-size: 1.4em;
  }
}
</style>
