<template>
  <div class="home-page-container">
    <div class="hero">
      <img src="https://picsum.photos/1200/600" alt="big" class="big-image" />
      <img src="https://picsum.photos/500/600" alt="big" class="small-image" />
      <div class="overlay">
        <h1 class="title">SN BEAUTY</h1>
        <div class="content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            et commodo ligula. Orci varius natoque penatibus et magnis dis
            parturient montes, nascetur ridiculus mus. Pellentesque euismod
            tempus lectus, et auctor enim tempus et.
          </p>
          <button>BOKA BEHANDLING</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [], // This will store the products
    };
  },
  created() {},
  methods: {},
  name: "HomeView",
};
</script>

<style>
.home-page-container {
  max-width: 1280px;
  margin: 0 auto;
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
